package com.wanderlust.api.dto.hotelDTO;

import com.wanderlust.api.entity.Room;
import com.wanderlust.api.entity.types.ApprovalStatus;
import com.wanderlust.api.entity.types.CancellationPolicyType;
import com.wanderlust.api.entity.types.RoomStatusType;
import com.wanderlust.api.entity.types.RoomType;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RoomDTO {
    private String id;
    private String hotelId;
    private String name;
    private RoomType type;
    private Integer maxOccupancy;
    private String bedType;
    private BigDecimal size;
    private String description;
    private List<Room.RoomImage> images;
    private List<String> amenities;
    private BigDecimal basePrice;
    private BigDecimal originalPrice;
    private Integer totalRooms;
    private Integer availableRooms;
    private CancellationPolicyType cancellationPolicy;
    private Boolean breakfastIncluded;
    private RoomStatusType status;
    private ApprovalStatus approvalStatus;
    private List<Room.RoomOption> options;
}