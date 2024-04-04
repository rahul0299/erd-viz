package com.erd.ERtoSQL.domain.SQLElements;

import com.erd.ERtoSQL.domain.ERElements.Entity;
import lombok.Data;
import org.apache.commons.lang3.tuple.MutablePair;

import java.util.List;

@Data
public class Table {

    String name;
    List<String> attributes;
    List<String> primaryKey;
    //Attribute,Entity
    List<MutablePair<List<String>, String>> foreignKeys;

    public Table(String name, List<String> attributes, List<String> primaryKey, List<MutablePair<List<String>, String >> foreignKeys) {
        this.name = name;
        this.attributes = attributes;
        this.primaryKey = primaryKey;
        this.foreignKeys = foreignKeys;
    }
}
