package com.wanderlust.api.configure;

import com.wanderlust.api.entity.types.Gender;

public class GenderDeserializer extends BaseEnumDeserializer<Gender> {
    
    public GenderDeserializer() {
        super(Gender.class);
    }
}
