package com.wanderlust.api.seeder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

@Component
public class DatabaseRepair implements CommandLineRunner {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Fix _class for Users
        // Many users imported from JSON have the wrong class name "com.example.demo.entities.User"
        // This causes Spring Data MongoDB to fail when reading them, leading to "User not found" and 401 errors.
        Query query = new Query(Criteria.where("_class").is("com.example.demo.entities.User"));
        Update update = new Update().set("_class", "com.wanderlust.api.entity.User");
        var result = mongoTemplate.updateMulti(query, update, "users");
        
        if (result.getModifiedCount() > 0) {
            System.out.println("✅ Repaired " + result.getModifiedCount() + " user documents with wrong _class.");
        } else {
            System.out.println("ℹ️ No user documents needed repair.");
        }
    }
}
