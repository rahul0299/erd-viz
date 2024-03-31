package com.erd.ERtoSQL.domain.SQLElements;

import com.erd.ERtoSQL.domain.ERElements.Entity;
import org.apache.commons.lang3.tuple.MutablePair;

import java.util.List;

public class Table {

    String name;
    List<String> attributes;
    String primaryKey;

    List<MutablePair<String, Entity>> foreignKeys;
}
