package com.erd.ERtoSQL.domain.ERElements;

import java.util.ArrayList;
import java.util.List;

public  abstract class Node {
    List<String> attributes;

    String primaryKey;

    String name;

    public Node(){

    }

//    public void addToAttributes(String attribute){
//        if(attribute.isPrimary!=null && attribute.isPrimary){
//            primaryKey=attribute;
//        } else {
//            attributes.add(attribute);
//        }
//
//    }

}
