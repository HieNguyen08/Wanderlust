"""
Full Crawl Script - Execute all crawling phases
Phase 1: Vietnam (63 provinces)
Phase 2: Southeast Asia (30 cities)
Phase 3: East Asia (22 cities)
"""

import asyncio
import logging
from pathlib import Path
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from production_crawler import (
    ProductionOSMCrawler,
    MongoDBManager,
    ProgressTracker,
    CrawlerConfig
)
from regions_config import (
    get_vietnam_regions,
    get_regions_by_country,
    get_priority_regions
)

# ============================================================================
# Crawling Phases
# ============================================================================

async def phase_1_vietnam(crawler, logger):
    """Phase 1: Crawl all Vietnam provinces"""
    logger.info("\n" + "="*70)
    logger.info("PHASE 1: VIETNAM (63 provinces)")
    logger.info("="*70)
    
    vietnam_regions = get_vietnam_regions()
    logger.info(f"Total regions: {len(vietnam_regions)}")
    logger.info(f"Estimated POIs: {sum(r.estimated_pois for r in vietnam_regions):,}")
    
    # Sort by priority
    vietnam_regions.sort(key=lambda r: (r.priority, -r.estimated_pois))
    
    logger.info("\nTop 10 regions:")
    for i, region in enumerate(vietnam_regions[:10], 1):
        logger.info(f"  {i}. {region.name} - Priority {region.priority} - ~{region.estimated_pois:,} POIs")
    
    await crawler.crawl_all_regions(vietnam_regions)

async def phase_2_southeast_asia(crawler, logger):
    """Phase 2: Crawl Southeast Asia cities"""
    logger.info("\n" + "="*70)
    logger.info("PHASE 2: SOUTHEAST ASIA (8 countries)")
    logger.info("="*70)
    
    countries = ["Thailand", "Singapore", "Malaysia", "Indonesia", 
                 "Philippines", "Cambodia", "Laos", "Myanmar"]
    
    regions = []
    for country in countries:
        country_regions = get_regions_by_country(country)
        regions.extend(country_regions)
        logger.info(f"{country}: {len(country_regions)} regions")
    
    # Sort by priority
    regions.sort(key=lambda r: (r.priority, -r.estimated_pois))
    
    logger.info(f"\nTotal regions: {len(regions)}")
    logger.info(f"Estimated POIs: {sum(r.estimated_pois for r in regions):,}")
    
    await crawler.crawl_all_regions(regions)

async def phase_3_east_asia(crawler, logger):
    """Phase 3: Crawl East Asia cities"""
    logger.info("\n" + "="*70)
    logger.info("PHASE 3: EAST ASIA (5 countries/regions)")
    logger.info("="*70)
    
    countries = ["Japan", "South Korea", "China", "Taiwan", "Hong Kong"]
    
    regions = []
    for country in countries:
        country_regions = get_regions_by_country(country)
        regions.extend(country_regions)
        logger.info(f"{country}: {len(country_regions)} regions")
    
    # Sort by priority
    regions.sort(key=lambda r: (r.priority, -r.estimated_pois))
    
    logger.info(f"\nTotal regions: {len(regions)}")
    logger.info(f"Estimated POIs: {sum(r.estimated_pois for r in regions):,}")
    
    await crawler.crawl_all_regions(regions)

# ============================================================================
# Main Execution
# ============================================================================

async def main():
    """Execute all crawling phases"""
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(
                CrawlerConfig.OUTPUT_DIR / "full_crawl.log",
                encoding='utf-8'
            )
        ]
    )
    
    logger = logging.getLogger("FullCrawl")
    
    logger.info("="*70)
    logger.info("WANDERLUST FULL DATA COLLECTION")
    logger.info("="*70)
    logger.info("\n📋 Plan:")
    logger.info("  Phase 1: Vietnam - 63 provinces (~194K POIs)")
    logger.info("  Phase 2: Southeast Asia - 30 cities (~125K POIs)")
    logger.info("  Phase 3: East Asia - 22 cities (~184K POIs)")
    logger.info("  TOTAL: 114 regions (~503K POIs)")
    
    logger.info("\n⏱️  Estimated time:")
    logger.info("  - Phase 1: 6-8 hours")
    logger.info("  - Phase 2: 3-4 hours")
    logger.info("  - Phase 3: 4-5 hours")
    logger.info("  - TOTAL: 13-17 hours")
    
    logger.info("\n💾 Data will be saved to:")
    logger.info(f"  - MongoDB: {CrawlerConfig.DB_NAME}")
    logger.info(f"  - Progress: {CrawlerConfig.PROGRESS_FILE}")
    logger.info(f"  - Logs: {CrawlerConfig.OUTPUT_DIR}")
    
    # Ask for confirmation
    print("\n" + "="*70)
    response = input("🚀 Start full crawl? (yes/no): ").strip().lower()
    if response != "yes":
        logger.info("❌ Crawl cancelled by user")
        return
    
    # Initialize components
    config = CrawlerConfig()
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    progress = ProgressTracker(config.PROGRESS_FILE)
    db = MongoDBManager(config.MONGO_URI, config.DB_NAME)
    
    # Print initial database state
    logger.info("\n📊 Initial Database State:")
    stats = db.get_stats()
    logger.info(f"  Total POIs: {stats['total_pois']:,}")
    
    # Create crawler
    async with ProductionOSMCrawler(config, db, progress) as crawler:
        # Execute phases
        try:
            await phase_1_vietnam(crawler, logger)
            logger.info("\n✅ Phase 1 Complete!")
            
            await phase_2_southeast_asia(crawler, logger)
            logger.info("\n✅ Phase 2 Complete!")
            
            await phase_3_east_asia(crawler, logger)
            logger.info("\n✅ Phase 3 Complete!")
            
        except KeyboardInterrupt:
            logger.warning("\n⚠️  Crawl interrupted by user")
            logger.info("Progress has been saved. Run again to resume.")
            return
        except Exception as e:
            logger.error(f"\n❌ Error during crawl: {e}")
            import traceback
            traceback.print_exc()
            return
    
    # Final statistics
    logger.info("\n" + "="*70)
    logger.info("🎉 ALL PHASES COMPLETE!")
    logger.info("="*70)
    
    final_stats = db.get_stats()
    logger.info(f"\n📊 Final Database Statistics:")
    logger.info(f"  Total POIs: {final_stats['total_pois']:,}")
    logger.info(f"\n  By Country:")
    for country in sorted(final_stats['by_country'].keys()):
        count = final_stats['by_country'][country]
        logger.info(f"    - {country}: {count:,}")
    
    progress_stats = progress.get_stats()
    logger.info(f"\n  Regions:")
    logger.info(f"    - Completed: {progress_stats['completed']}")
    logger.info(f"    - Failed: {progress_stats['failed']}")
    
    logger.info("\n🎯 Next Steps:")
    logger.info("  1. Enhance POIs with Wikipedia descriptions")
    logger.info("  2. Calculate distance matrices (OSRM)")
    logger.info("  3. Extract features with PhoBERT/TF-IDF")
    logger.info("  4. Train ML models (K-Means, NMF)")
    logger.info("  5. Launch backend API")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
