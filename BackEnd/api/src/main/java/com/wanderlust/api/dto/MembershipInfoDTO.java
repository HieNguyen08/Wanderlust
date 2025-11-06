package com.wanderlust.api.dto;

import com.wanderlust.api.entity.types.MembershipLevel;
import lombok.Data;

@Data
public class MembershipInfoDTO {
    private MembershipLevel currentLevel;
    private Integer currentPoints;
    private MembershipLevel nextLevel;
    private Integer pointsForNextLevel;
    private Double progressPercentage; // % tiến độ lên hạng (ví dụ: 80.5)
}