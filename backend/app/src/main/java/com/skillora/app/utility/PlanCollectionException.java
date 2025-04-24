package com.skillora.app.utility;

public class PlanCollectionException extends Exception{

    /**
     * 
     */

     private static final long serialVersionID = 1L;

     public PlanCollectionException(String message) {
        super(message);
     }

     public static String NotFoundException(String id) {
        return "Plan with" +id+ "not found!";
     }

     public static String PlanAllreadyExists(){
        return "Todo with given name already exists";
     }
     

}
