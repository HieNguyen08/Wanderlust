
const fs = require('fs');

const sources = {
    'hanoi': 'https://unsplash.com/s/photos/hanoi',
    'ho_chi_minh': 'https://unsplash.com/s/photos/ho-chi-minh-city',
    'danang': 'https://unsplash.com/s/photos/danang',
    'hoi_an': 'https://unsplash.com/s/photos/hoi-an',
    'nha_trang': 'https://unsplash.com/s/photos/nha-trang',
    'phu_quoc': 'https://unsplash.com/s/photos/phu-quoc-vietnam',
    'ha_long': 'https://unsplash.com/s/photos/halong-bay',
    'da_lat': 'https://unsplash.com/s/photos/da-lat-vietnam',
    'hue': 'https://unsplash.com/s/photos/hue-vietnam',
    'vung_tau': 'https://unsplash.com/s/photos/vung-tau',
    'quy_nhon': 'https://unsplash.com/s/photos/quy-nhon',
    'phan_thiet': 'https://unsplash.com/s/photos/phan-thiet',
    'buon_ma_thuot': 'https://unsplash.com/s/photos/buon-ma-thuot',
    'vinh': 'https://unsplash.com/s/photos/vinh-vietnam',
    'can_tho': 'https://unsplash.com/s/photos/can-tho-vietnam',
    'hai_phong': 'https://unsplash.com/s/photos/hai-phong-vietnam',
    'thanh_hoa': 'https://unsplash.com/s/photos/thanh-hoa-vietnam',
    'ninh_binh': 'https://unsplash.com/s/photos/ninh-binh',
    'ha_giang': 'https://unsplash.com/s/photos/ha-giang',
    'sa_pa': 'https://unsplash.com/s/photos/sapa-vietnam',
    'cao_bang': 'https://unsplash.com/s/photos/cao-bang-vietnam',
    'moc_chau': 'https://unsplash.com/s/photos/moc-chau',
    'dong_hoi': 'https://unsplash.com/s/photos/quang-binh',
    'pleiku': 'https://unsplash.com/s/photos/pleiku',
    'tuy_hoa': 'https://unsplash.com/s/photos/phu-yen-vietnam',
    'con_dao': 'https://unsplash.com/s/photos/con-dao',
    'hai_duong': 'https://unsplash.com/s/photos/hai-duong-vietnam',
    'nam_dinh': 'https://unsplash.com/s/photos/nam-dinh-vietnam',
    'thai_nguyen': 'https://unsplash.com/s/photos/thai-nguyen-vietnam',
    'viet_tri': 'https://unsplash.com/s/photos/phu-to-vietnam',
    'dien_bien_phu': 'https://unsplash.com/s/photos/dien-bien-phu',
    'son_la': 'https://unsplash.com/s/photos/son-la-vietnam',
    'hoa_binh': 'https://unsplash.com/s/photos/hoa-binh-vietnam',
    'ca_mau': 'https://unsplash.com/s/photos/ca-mau-vietnam',
    'soc_trang': 'https://unsplash.com/s/photos/soc-trang-vietnam',
    'lang_son': 'https://unsplash.com/s/photos/lang-son-vietnam',
    'lao_cai': 'https://unsplash.com/s/photos/lao-cai-vietnam',
    'food': 'https://unsplash.com/s/photos/vietnamese-food',
    'hotel_ext': 'https://unsplash.com/s/photos/luxury-hotel-building',
    'hotel_room': 'https://unsplash.com/s/photos/hotel-interior-room',
    'car_suv': 'https://unsplash.com/s/photos/suv',
    'car_sedan': 'https://unsplash.com/s/photos/sedan-car',
    'car_luxury': 'https://unsplash.com/s/photos/luxury-car',
    'activity_cooking': 'https://unsplash.com/s/photos/cooking-food',
    'activity_kayak': 'https://unsplash.com/s/photos/kayak',
    'activity_temple': 'https://unsplash.com/s/photos/temple',
    'activity_market': 'https://unsplash.com/s/photos/market'
};

const results = {};

async function scrape() {
    for (const [key, url] of Object.entries(sources)) {
        try {
            console.error(`Fetching ${key}...`);
            const response = await fetch(url);
            const text = await response.text();

            // Regex to find photo IDs in src attributes
            // Look for https://images.unsplash.com/photo-ID?
            const matches = text.match(/https:\/\/images\.unsplash\.com\/photo-[\w-]+/g);

            if (matches) {
                // Filter duplicates and keep valid ones
                const unique = [...new Set(matches)].filter(u => u.length > 40); // Filter out too short matches
                // Add default query param for better quality
                results[key] = unique.slice(0, 15).map(u => u + '?auto=format&fit=crop&w=800&q=80');
            } else {
                results[key] = [];
            }
        } catch (e) {
            console.error(`Error fetching ${key}:`, e.message);
            results[key] = [];
        }
    }

    fs.writeFileSync('scraped_urls.json', JSON.stringify(results, null, 2));
}

scrape();
