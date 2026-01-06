# Algorithm Comparison Module

## 📁 Cấu trúc folder

```
algorithm_comparison/
├── benchmark.py              # Main benchmark framework
├── requirements.txt          # Python dependencies
├── algorithms/              # Implementations của các thuật toán
│   ├── __init__.py
│   ├── mdpi_full.py        # Full implementation bài báo MDPI
│   ├── plustour.py         # Implementation PlusTour (bài báo 2)
│   └── smart_travel.py     # Implementation bài báo 1
├── data/                    # Test data
│   ├── vietnam_pois.json
│   └── sample_users.json
└── results/                 # Benchmark results
    ├── comparison_report.md
    └── performance_charts.png
```

## 🚀 Sử dụng

### 1. Cài đặt dependencies

```bash
cd "Data Algorithm/algorithm_comparison"
pip install -r requirements.txt
```

### 2. Chạy benchmark

```bash
python benchmark.py
```

### 3. Xem kết quả

Kết quả sẽ được in ra console và lưu vào folder `results/`

## 📊 Metrics được đo

1. **Average POIs Recommended**: Số POI trung bình được gợi ý
2. **Average Preference Score**: Điểm preference trung bình
3. **Average Time**: Thời gian tour trung bình
4. **Average Cost**: Chi phí trung bình
5. **Computation Time**: Thời gian tính toán (ms)
6. **Time Satisfaction Rate**: Tỷ lệ đáp ứng time constraint
7. **Budget Satisfaction Rate**: Tỷ lệ đáp ứng budget constraint

## 🎯 Next Steps

1. ✅ Hoàn thiện benchmark framework cơ bản
2. ⏳ Implement đầy đủ thuật toán MDPI (với NMF, clustering)
3. ⏳ Đọc và implement thuật toán từ bài báo 1 & 2
4. ⏳ Thêm multi-objective optimization
5. ⏳ Test với Vietnam POI data thực tế
6. ⏳ Tối ưu performance

## 📝 Notes

- Hiện tại là simplified implementation để demo
- Cần data thực tế từ Vietnam để test chính xác
- Budget optimization chưa được implement đầy đủ trong MDPI
