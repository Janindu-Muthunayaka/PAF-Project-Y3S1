package com.skillora.app.Exception;

public class PlanCollectionException extends Exception {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public PlanCollectionException(String message) {
        super(message);
    }

    public static String NotFoundException(String id) {
        return "Plan with " + id + " not found";
    }

    public static String PlanAlreadyExists() {
        return "Plan with already exists";
    }
}
