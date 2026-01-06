"""
BENCHMARK FRAMEWORK FOR TRAVEL RECOMMENDATION ALGORITHMS
=========================================================

Module này cung cấp framework để so sánh hiệu quả của các thuật toán
recommendation cho hệ thống AI Assistant của Wanderlust.

Các thuật toán được so sánh:
1. Bài báo 1: Smart Travel Planning (TBD)
2. Bài báo 2: PlusTour Multi-Objective Optimization (TBD)
3. Bài báo 3: MDPI Implicit & Dynamic Information

Author: AI Assistant for Wanderlust
Date: 2026-01-06
"""

import time
import numpy as np
from typing import List, Dict, Tuple
from dataclasses import dataclass
from abc import ABC, abstractmethod


@dataclass
class POI:
    """Point of Interest data structure"""
    id: int
    name: str
    lat: float
    lon: float
    category: str
    description: str
    avg_staying_time: float  # hours
    popularity: float  # 0-1
    cost: float  # VND


@dataclass
class User:
    """User profile data structure"""
    id: int
    visited_pois: List[int]
    preferences: Dict[str, float]
    budget: float
    time_limit: float  # hours


@dataclass
class Itinerary:
    """Recommended itinerary result"""
    pois: List[int]
    total_time: float
    total_cost: float
    preference_score: float
    algorithm_name: str
    computation_time: float  # seconds


class RecommendationAlgorithm(ABC):
    """Base class for recommendation algorithms"""
    
    def __init__(self, name: str):
        self.name = name
    
    @abstractmethod
    def recommend(self, user: User, pois: List[POI], 
                  start_time: int, time_limit: float) -> Itinerary:
        """Generate itinerary recommendation"""
        pass


class BaselineRandomAlgorithm(RecommendationAlgorithm):
    """Baseline: Random POI selection"""
    
    def __init__(self):
        super().__init__("Random Baseline")
    
    def recommend(self, user: User, pois: List[POI], 
                  start_time: int, time_limit: float) -> Itinerary:
        start = time.time()
        
        # Filter unvisited POIs
        unvisited = [p for p in pois if p.id not in user.visited_pois]
        
        # Randomly select POIs
        np.random.shuffle(unvisited)
        
        selected = []
        total_time = 0
        total_cost = 0
        
        for poi in unvisited:
            if total_time + poi.avg_staying_time <= time_limit:
                if total_cost + poi.cost <= user.budget:
                    selected.append(poi.id)
                    total_time += poi.avg_staying_time
                    total_cost += poi.cost
        
        computation_time = time.time() - start
        
        return Itinerary(
            pois=selected,
            total_time=total_time,
            total_cost=total_cost,
            preference_score=0,
            algorithm_name=self.name,
            computation_time=computation_time
        )


class GreedyNearestAlgorithm(RecommendationAlgorithm):
    """Baseline: Greedy nearest POI selection"""
    
    def __init__(self):
        super().__init__("Greedy Nearest")
    
    def _haversine_distance(self, lat1: float, lon1: float, 
                            lat2: float, lon2: float) -> float:
        """Calculate great circle distance in km"""
        R = 6371  # Earth radius in km
        
        lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
        c = 2 * np.arcsin(np.sqrt(a))
        
        return R * c
    
    def recommend(self, user: User, pois: List[POI], 
                  start_time: int, time_limit: float) -> Itinerary:
        start = time.time()
        
        unvisited = [p for p in pois if p.id not in user.visited_pois]
        
        if not unvisited:
            return Itinerary([], 0, 0, 0, self.name, time.time() - start)
        
        # Start from first POI
        selected = [unvisited[0]]
        total_time = unvisited[0].avg_staying_time
        total_cost = unvisited[0].cost
        
        current_poi = unvisited[0]
        remaining = [p for p in unvisited if p.id != current_poi.id]
        
        while remaining and total_time < time_limit:
            # Find nearest POI
            distances = [
                self._haversine_distance(current_poi.lat, current_poi.lon, 
                                          p.lat, p.lon)
                for p in remaining
            ]
            
            nearest_idx = np.argmin(distances)
            nearest_poi = remaining[nearest_idx]
            
            # Check constraints
            travel_time = distances[nearest_idx] / 40  # Assume 40 km/h
            new_total_time = total_time + travel_time + nearest_poi.avg_staying_time
            new_total_cost = total_cost + nearest_poi.cost
            
            if new_total_time <= time_limit and new_total_cost <= user.budget:
                selected.append(nearest_poi)
                total_time = new_total_time
                total_cost = new_total_cost
                current_poi = nearest_poi
                remaining.pop(nearest_idx)
            else:
                break
        
        computation_time = time.time() - start
        
        return Itinerary(
            pois=[p.id for p in selected],
            total_time=total_time,
            total_cost=total_cost,
            preference_score=0,
            algorithm_name=self.name,
            computation_time=computation_time
        )


class MDPIAlgorithmSimplified(RecommendationAlgorithm):
    """
    Simplified implementation of MDPI paper algorithm
    (Bài báo 3: Tour Recommendation System Considering Implicit and Dynamic Information)
    
    Bao gồm:
    - User preference calculation (POP + ATT)
    - Greedy itinerary generation
    """
    
    def __init__(self):
        super().__init__("MDPI Simplified")
    
    def _calculate_popularity(self, poi: POI, all_pois: List[POI]) -> float:
        """Calculate POI popularity"""
        # Giả sử popularity đã được tính sẵn
        return poi.popularity
    
    def _calculate_attraction(self, user: User, poi: POI) -> float:
        """Calculate POI attraction for user"""
        # Simplified: dựa vào user preferences và POI category
        if poi.category in user.preferences:
            return user.preferences[poi.category]
        return 0.5  # Default
    
    def _calculate_preference(self, user: User, poi: POI, 
                              all_pois: List[POI]) -> float:
        """Calculate user preference score"""
        w_pop = 0.7  # Weight for popularity
        w_att = 0.3  # Weight for attraction
        
        pop = self._calculate_popularity(poi, all_pois)
        att = self._calculate_attraction(user, poi)
        
        return w_pop * pop + w_att * att
    
    def recommend(self, user: User, pois: List[POI], 
                  start_time: int, time_limit: float) -> Itinerary:
        start = time.time()
        
        # Filter unvisited POIs
        unvisited = [p for p in pois if p.id not in user.visited_pois]
        
        # Calculate preference scores
        poi_scores = [
            (p, self._calculate_preference(user, p, pois))
            for p in unvisited
        ]
        
        # Sort by preference (descending)
        poi_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Greedy selection
        selected = []
        total_time = 0
        total_cost = 0
        preference_score = 0
        
        for poi, score in poi_scores:
            new_time = total_time + poi.avg_staying_time
            new_cost = total_cost + poi.cost
            
            if new_time <= time_limit and new_cost <= user.budget:
                selected.append(poi.id)
                total_time = new_time
                total_cost = new_cost
                preference_score += score
        
        computation_time = time.time() - start
        
        return Itinerary(
            pois=selected,
            total_time=total_time,
            total_cost=total_cost,
            preference_score=preference_score,
            algorithm_name=self.name,
            computation_time=computation_time
        )


class BenchmarkFramework:
    """Framework to benchmark and compare algorithms"""
    
    def __init__(self):
        self.algorithms: List[RecommendationAlgorithm] = []
        self.results: List[Itinerary] = []
    
    def add_algorithm(self, algorithm: RecommendationAlgorithm):
        """Add algorithm to benchmark"""
        self.algorithms.append(algorithm)
    
    def run_benchmark(self, users: List[User], pois: List[POI], 
                      start_time: int = 9, time_limit: float = 8.0) -> Dict:
        """Run benchmark on all algorithms"""
        
        print(f"\n{'='*80}")
        print(f"RUNNING BENCHMARK FOR TRAVEL RECOMMENDATION ALGORITHMS")
        print(f"{'='*80}")
        print(f"Test set: {len(users)} users, {len(pois)} POIs")
        print(f"Time limit: {time_limit} hours")
        print(f"{'='*80}\n")
        
        results = {
            'algorithms': [],
            'metrics': {}
        }
        
        for algo in self.algorithms:
            print(f"\nTesting: {algo.name}")
            print("-" * 80)
            
            algo_results = []
            total_comp_time = 0
            
            for i, user in enumerate(users):
                itinerary = algo.recommend(user, pois, start_time, time_limit)
                algo_results.append(itinerary)
                total_comp_time += itinerary.computation_time
                
                if (i + 1) % 10 == 0:
                    print(f"  Processed {i+1}/{len(users)} users...")
            
            # Calculate metrics
            avg_pois = np.mean([len(r.pois) for r in algo_results])
            avg_time = np.mean([r.total_time for r in algo_results])
            avg_cost = np.mean([r.total_cost for r in algo_results])
            avg_score = np.mean([r.preference_score for r in algo_results])
            avg_comp_time = total_comp_time / len(users)
            
            # Calculate constraint satisfaction
            time_satisfied = sum(1 for r in algo_results if r.total_time <= time_limit)
            budget_satisfied = sum(1 for r in algo_results 
                                   if r.total_cost <= users[i].budget)
            
            results['algorithms'].append(algo.name)
            results['metrics'][algo.name] = {
                'avg_pois': avg_pois,
                'avg_time': avg_time,
                'avg_cost': avg_cost,
                'avg_preference_score': avg_score,
                'avg_computation_time': avg_comp_time,
                'time_satisfaction_rate': time_satisfied / len(users),
                'budget_satisfaction_rate': budget_satisfied / len(users)
            }
            
            print(f"\n  Results:")
            print(f"    Average POIs recommended: {avg_pois:.2f}")
            print(f"    Average total time: {avg_time:.2f} hours")
            print(f"    Average total cost: {avg_cost:,.0f} VND")
            print(f"    Average preference score: {avg_score:.4f}")
            print(f"    Average computation time: {avg_comp_time*1000:.2f} ms")
            print(f"    Time constraint satisfied: {time_satisfied/len(users)*100:.1f}%")
            print(f"    Budget constraint satisfied: {budget_satisfied/len(users)*100:.1f}%")
        
        self.results = results
        return results
    
    def print_comparison_table(self):
        """Print comparison table"""
        if not self.results:
            print("No results available. Run benchmark first.")
            return
        
        print(f"\n{'='*80}")
        print("COMPARISON TABLE")
        print(f"{'='*80}\n")
        
        metrics_order = [
            ('avg_pois', 'Avg POIs', '{:.2f}', 'higher'),
            ('avg_preference_score', 'Avg Score', '{:.4f}', 'higher'),
            ('avg_time', 'Avg Time (h)', '{:.2f}', 'lower'),
            ('avg_cost', 'Avg Cost (VND)', '{:,.0f}', 'lower'),
            ('avg_computation_time', 'Comp Time (ms)', '{:.2f}', 'lower'),
            ('time_satisfaction_rate', 'Time OK %', '{:.1%}', 'higher'),
            ('budget_satisfaction_rate', 'Budget OK %', '{:.1%}', 'higher')
        ]
        
        # Header
        print(f"{'Algorithm':<25}", end='')
        for _, label, _, _ in metrics_order:
            print(f"{label:>15}", end='')
        print()
        print("-" * 130)
        
        # Data rows
        for algo_name in self.results['algorithms']:
            metrics = self.results['metrics'][algo_name]
            print(f"{algo_name:<25}", end='')
            
            for metric_key, _, fmt, _ in metrics_order:
                value = metrics[metric_key]
                if 'time' in metric_key and metric_key == 'avg_computation_time':
                    value *= 1000  # Convert to ms
                formatted = fmt.format(value)
                print(f"{formatted:>15}", end='')
            print()
        
        print("-" * 130)
        
        # Best performers
        print("\n🏆 BEST PERFORMERS:")
        for metric_key, label, fmt, direction in metrics_order:
            values = {
                algo: self.results['metrics'][algo][metric_key]
                for algo in self.results['algorithms']
            }
            
            if direction == 'higher':
                best_algo = max(values, key=values.get)
            else:
                best_algo = min(values, key=values.get)
            
            best_value = values[best_algo]
            if 'time' in metric_key and metric_key == 'avg_computation_time':
                best_value *= 1000
            
            print(f"  {label}: {best_algo} ({fmt.format(best_value)})")
        
        print()


def generate_sample_data() -> Tuple[List[User], List[POI]]:
    """Generate sample test data"""
    
    # Sample POIs (Vietnam destinations)
    pois = [
        POI(1, "Hồ Hoàn Kiếm", 21.0285, 105.8542, "landmark", 
            "Hồ nước ngọt nằm ở trung tâm Hà Nội", 1.0, 0.95, 0),
        POI(2, "Chùa Một Cột", 21.0355, 105.8345, "temple",
            "Ngôi chùa lịch sử với kiến trúc độc đáo", 0.5, 0.85, 0),
        POI(3, "Văn Miếu Quốc Tử Giám", 21.0277, 105.8359, "historical",
            "Trường đại học đầu tiên của Việt Nam", 1.5, 0.90, 30000),
        POI(4, "Bảo tàng Hồ Chí Minh", 21.0368, 105.8345, "museum",
            "Bảo tàng về cuộc đời Bác Hồ", 1.0, 0.80, 40000),
        POI(5, "Phố cổ Hà Nội", 21.0349, 105.8521, "shopping",
            "Khu phố cổ với nhiều cửa hàng", 2.0, 0.92, 200000),
        POI(6, "Nhà hát Lớn", 21.0240, 105.8578, "cultural",
            "Công trình kiến trúc Pháp đẹp", 1.0, 0.78, 0),
        POI(7, "Lăng Chủ tịch Hồ Chí Minh", 21.0374, 105.8347, "landmark",
            "Lăng Bác Hồ trang nghiêm", 1.0, 0.95, 0),
        POI(8, "Bún chả Hàng Mành", 21.0330, 105.8510, "food",
            "Bún chả nổi tiếng Hà Nội", 0.5, 0.88, 80000),
        POI(9, "Cà phê trứng Giảng", 21.0351, 105.8530, "food",
            "Cà phê trứng đặc sản", 0.5, 0.85, 50000),
        POI(10, "Hồ Tây", 21.0583, 105.8192, "nature",
             "Hồ nước ngọt lớn nhất Hà Nội", 2.0, 0.82, 0),
    ]
    
    # Sample users
    users = []
    for i in range(20):
        users.append(User(
            id=i,
            visited_pois=list(np.random.choice(10, size=3, replace=False)) if i > 0 else [],
            preferences={
                'landmark': np.random.uniform(0.5, 1.0),
                'temple': np.random.uniform(0.3, 0.9),
                'historical': np.random.uniform(0.5, 1.0),
                'museum': np.random.uniform(0.4, 0.8),
                'shopping': np.random.uniform(0.6, 1.0),
                'cultural': np.random.uniform(0.5, 0.9),
                'food': np.random.uniform(0.7, 1.0),
                'nature': np.random.uniform(0.6, 0.95)
            },
            budget=np.random.uniform(300000, 500000),  # 300k - 500k VND
            time_limit=8.0  # 8 hours
        ))
    
    return users, pois


def main():
    """Main benchmark execution"""
    
    print("Generating sample data...")
    users, pois = generate_sample_data()
    
    print(f"Generated {len(users)} test users and {len(pois)} POIs")
    
    # Initialize benchmark
    benchmark = BenchmarkFramework()
    
    # Add algorithms
    benchmark.add_algorithm(BaselineRandomAlgorithm())
    benchmark.add_algorithm(GreedyNearestAlgorithm())
    benchmark.add_algorithm(MDPIAlgorithmSimplified())
    
    # Run benchmark
    results = benchmark.run_benchmark(users, pois)
    
    # Print comparison
    benchmark.print_comparison_table()
    
    print("\n" + "="*80)
    print("BENCHMARK COMPLETED")
    print("="*80)
    
    print("\n📝 NOTE: Đây là benchmark đơn giản với simplified algorithms.")
    print("   Cần implement đầy đủ algorithms từ các bài báo để so sánh chính xác.")


if __name__ == "__main__":
    main()
