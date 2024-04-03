package com.erd.ERtoSQL.domain.ERElements;


import lombok.Data;

@Data
public class Attribute{

    String name;

    String dataType;

    Boolean isNullable;

    Boolean isUnique;

    Boolean isPrimary;

    public Attribute(String name,String dataType,Boolean isNullable,Boolean isUnique,Boolean isPrimary) {
        this.name = name;
        this.dataType=dataType;
        this.isNullable=isNullable;
        this.isUnique=isUnique;
        this.isPrimary=isPrimary;
    }
}
