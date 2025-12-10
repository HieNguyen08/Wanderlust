
const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('scraped_urls.json'));
// const files = ['activities.json', 'hotels.json', 'rooms.json', 'car_rentals.json', 'travel_guides.json', 'locations.json', 'flights.json'];

// Helper to get random image from a list
function getRandom(listName) {
    const list = scraped[listName];
    if (list && list.length > 0) {
        return list[Math.floor(Math.random() * list.length)];
    }
    // Fallback if specific list missing, try to find a generic one or return hanoi
    return scraped['hanoi'][0];
}

function getLocationKey(text) {
    if (!text) return 'hanoi';
    const t = text.toLowerCase();
    if (t.includes('hanoi')) return 'hanoi';
    if (t.includes('ho chi minh') || t.includes('hcm') || t.includes('saigon')) return 'ho_chi_minh';
    if (t.includes('da nang') || t.includes('danang')) return 'danang';
    if (t.includes('hoi an') || t.includes('hoian')) return 'hoi_an';
    if (t.includes('nha trang') || t.includes('nhatrang')) return 'nha_trang';
    if (t.includes('phu quoc') || t.includes('phuquoc')) return 'phu_quoc';
    if (t.includes('ha long') || t.includes('halong')) return 'ha_long';
    if (t.includes('da lat') || t.includes('dalat')) return 'da_lat';
    if (t.includes('hue')) return 'hue';
    if (t.includes('vung tau') || t.includes('vungtau')) return 'vung_tau';
    if (t.includes('quy nhon') || t.includes('quynhon')) return 'quy_nhon';
    if (t.includes('phan thiet') || t.includes('phanthiet')) return 'phan_thiet';
    if (t.includes('buon ma thuot') || t.includes('buonmathuot')) return 'buon_ma_thuot';
    if (t.includes('vinh')) return 'vinh';
    if (t.includes('can tho') || t.includes('cantho')) return 'can_tho';
    if (t.includes('hai phong') || t.includes('haiphong')) return 'hai_phong';
    if (t.includes('thanh hoa') || t.includes('thanhhoa')) return 'thanh_hoa';
    if (t.includes('ninh binh') || t.includes('ninhbinh')) return 'ninh_binh';
    if (t.includes('ha giang') || t.includes('hagiang')) return 'ha_giang';
    if (t.includes('sa pa') || t.includes('sapa')) return 'sa_pa';
    if (t.includes('cao bang') || t.includes('caobang')) return 'cao_bang';
    if (t.includes('moc chau') || t.includes('mocchau')) return 'moc_chau';
    if (t.includes('dong hoi') || t.includes('donghoi')) return 'dong_hoi';
    if (t.includes('pleiku')) return 'pleiku';
    if (t.includes('tuy hoa') || t.includes('tuyhoa')) return 'tuy_hoa';
    if (t.includes('con dao') || t.includes('condao')) return 'con_dao';
    if (t.includes('hai duong') || t.includes('haiduong')) return 'hai_duong';
    if (t.includes('nam dinh') || t.includes('namdinh')) return 'nam_dinh';
    if (t.includes('thai nguyen') || t.includes('thainguyen')) return 'thai_nguyen';
    if (t.includes('viet tri') || t.includes('viettri')) return 'viet_tri';
    if (t.includes('dien bien phu') || t.includes('dienbienphu')) return 'dien_bien_phu';
    if (t.includes('son la') || t.includes('sonla')) return 'son_la';
    if (t.includes('hoa binh') || t.includes('hoabinh')) return 'hoa_binh';
    if (t.includes('ca mau') || t.includes('camau')) return 'ca_mau';
    if (t.includes('soc trang') || t.includes('soctrang')) return 'soc_trang';
    if (t.includes('lang son') || t.includes('langson')) return 'lang_son';
    if (t.includes('lao cai') || t.includes('laocai')) return 'lao_cai';

    // Default fallback for Vietnam country
    if (t.includes('vietnam')) return 'ha_long';

    return null;
}

function updateActivities() {
    console.log('Updating activities.json...');
    const data = JSON.parse(fs.readFileSync('activities.json'));
    data.forEach(item => {
        let key = 'activity_market';
        const name = item.name.toLowerCase();

        if (name.includes('cooking') || name.includes('food') || name.includes('dining')) key = 'activity_cooking';
        else if (name.includes('temple') || name.includes('historical') || name.includes('tour')) key = 'activity_temple';
        else if (name.includes('kayak') || name.includes('surfing') || name.includes('water') || name.includes('jet ski') || name.includes('snorkeling')) key = 'activity_kayak';
        else if (name.includes('market')) key = 'activity_market';
        else if (name.includes('food')) key = 'food';

        if (item.images) {
            item.images.forEach(img => {
                img.url = getRandom(key);
            });
        }
    });
    fs.writeFileSync('activities.json', JSON.stringify(data, null, 2));
}

function updateHotels() {
    console.log('Updating hotels.json...');
    const data = JSON.parse(fs.readFileSync('hotels.json'));
    data.forEach(item => {
        if (item.images) {
            item.images.forEach(img => {
                if (img.caption && img.caption.toLowerCase().includes('room')) {
                    img.url = getRandom('hotel_room');
                } else {
                    img.url = getRandom('hotel_ext');
                }
            });
        }
    });
    fs.writeFileSync('hotels.json', JSON.stringify(data, null, 2));
}

function updateRooms() {
    console.log('Updating rooms.json...');
    const data = JSON.parse(fs.readFileSync('rooms.json'));
    data.forEach(item => {
        if (item.images) {
            item.images.forEach(img => {
                img.url = getRandom('hotel_room');
            });
        }
    });
    fs.writeFileSync('rooms.json', JSON.stringify(data, null, 2));
}

function updateCars() {
    console.log('Updating car_rentals.json...');
    const data = JSON.parse(fs.readFileSync('car_rentals.json'));
    data.forEach(item => {
        let key = 'car_sedan';
        const type = item.type ? item.type.toLowerCase() : '';
        const brand = item.brand ? item.brand.toLowerCase() : '';

        if (type === 'suv' || type === 'pickup' || type === 'van') key = 'car_suv';
        else if (brand === 'bmw' || brand === 'mercedes-benz' || brand === 'audi' || brand === 'lexus') key = 'car_luxury';
        else key = 'car_sedan';

        if (item.images) {
            item.images.forEach(img => {
                img.url = getRandom(key);
            });
        }
    });
    fs.writeFileSync('car_rentals.json', JSON.stringify(data, null, 2));
}

function updateGuides() {
    console.log('Updating travel_guides.json...');
    const data = JSON.parse(fs.readFileSync('travel_guides.json'));
    data.forEach(item => {
        const loc = getLocationKey(item.destination || item.title) || 'hanoi';
        item.coverImage = getRandom(loc);
        if (item.images) {
            item.images = item.images.map(() => getRandom(loc));
        }
        if (item.attractions) {
            item.attractions.forEach(attr => {
                attr.image = getRandom(loc);
            });
        }
    });
    fs.writeFileSync('travel_guides.json', JSON.stringify(data, null, 2));
}

function updateLocations() {
    console.log('Updating locations.json...');
    const data = JSON.parse(fs.readFileSync('locations.json'));
    data.forEach(item => {
        const key = getLocationKey(item.name);
        if (key) {
            item.image = getRandom(key);
        } else {
            console.log(`No image key found for location: ${item.name}, using generic.`);
            item.image = getRandom('hanoi'); // generic fallback
        }
    });
    fs.writeFileSync('locations.json', JSON.stringify(data, null, 2));
}

function updateFlights() {
    console.log('Updating flights.json...');
    try {
        let content = fs.readFileSync('flights.json', 'utf8');
        // Remove BOM if present
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        const data = JSON.parse(content);
        const airlineLogos = {
            'VN': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Vietnam_Airlines_Logo.svg/1024px-Vietnam_Airlines_Logo.svg.png',
            'QH': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Bamboo_Airways_Logo_QH-BAV.png/800px-Bamboo_Airways_Logo_QH-BAV.png',
            'VJ': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/VietJet_Air_logo.png',
            'BL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Logo_h%C3%A3ng_Pacific_Airlines.svg/1024px-Logo_h%C3%A3ng_Pacific_Airlines.svg.png'
        };

        data.forEach((item, index) => {
            if (airlineLogos[item.airlineCode]) {
                item.airlineLogo = airlineLogos[item.airlineCode];
            }
            if (index % 10000 === 0) console.log(`Processed ${index} flights`);
        });
        fs.writeFileSync('flights.json', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error updating flights:', e);
    }
}

updateActivities();
updateHotels();
updateRooms();
updateCars();
updateGuides();
updateLocations();
updateFlights();
console.log('All files updated.');
