package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;


/**
 * Different abstract class for common methods for entities and relations
 */
@Data
public abstract class Structure {
    List<Attribute> attributes;
    Attribute primaryKey;

    public Structure(){
        attributes= new ArrayList<>();
    }

    public void addToAttributes(Attribute attribute){
        if(attribute.isPrimary!=null && attribute.isPrimary){
            primaryKey=attribute;
        } else {
            attributes.add(attribute);
        }

    }
}
