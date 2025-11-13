package com.wanderlust.api.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipDTO {
    private String title;
    private String content;
    private String icon;
}
