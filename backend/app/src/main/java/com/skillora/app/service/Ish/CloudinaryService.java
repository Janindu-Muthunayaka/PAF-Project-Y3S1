package com.skillora.app.service.Ish;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.skillora.app.model.Ish.Media;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    @SuppressWarnings("null")
    public Media uploadMedia(MultipartFile file) throws IOException {
        @SuppressWarnings("rawtypes")
        Map uploadResult;
        
        if (file.getContentType().startsWith("image/")) {
            uploadResult = cloudinary.uploader().upload(
                file.getBytes(), 
                ObjectUtils.asMap("resource_type", "image")
            );
            return new Media(
                uploadResult.get("secure_url").toString(),
                uploadResult.get("public_id").toString(),
                Media.MediaType.IMAGE
            );
        } else if (file.getContentType().startsWith("video/")) {
            // For videos, don't add the duration transformation
            uploadResult = cloudinary.uploader().upload(
                file.getBytes(), 
                ObjectUtils.asMap(
                    "resource_type", "video"
                    // Remove the "transformation", "duration_30" parameter
                )
            );
            
            // Get public ID and create a URL with duration limitation if needed
            String publicId = uploadResult.get("public_id").toString();
            String secureUrl = uploadResult.get("secure_url").toString();
            
            
            
            
            return new Media(
                secureUrl,
                publicId,
                Media.MediaType.VIDEO
            );
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + file.getContentType());
        }
    }
    
    @SuppressWarnings("null")
    public List<Media> uploadMultipleMedia(List<MultipartFile> files) throws IOException {
        List<Media> mediaList = new ArrayList<>();
        
        // Validate that there are at most 5 images or 1 video
        int imageCount = 0;
        int videoCount = 0;
        
        for (MultipartFile file : files) {
            if (file.getContentType().startsWith("image/")) {
                imageCount++;
            } else if (file.getContentType().startsWith("video/")) {
                videoCount++;
            }
        }
        
        if (imageCount > 0 && videoCount > 0) {
            throw new IllegalArgumentException("Cannot mix images and videos in the same post");
        }
        
        if (imageCount > 5) {
            throw new IllegalArgumentException("Maximum 5 images per post allowed");
        }
        
        if (videoCount > 1) {
            throw new IllegalArgumentException("Maximum 1 video per post allowed");
        }
        
        // Upload the validated files
        for (MultipartFile file : files) {
            mediaList.add(uploadMedia(file));
        }
        
        return mediaList;
    }
    
    public void deleteMedia(String publicId, Media.MediaType type) throws IOException {
        String resourceType = (type == Media.MediaType.IMAGE) ? "image" : "video";
        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
    }
}