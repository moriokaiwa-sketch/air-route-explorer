import json
import math

# Accurate list of JAL Group Domestic Airports (Including J-Air, JTA, RAC, JAC, HAC)
airports_data = {
    "HND": {"name": "東京(羽田)", "lat": 35.5494, "lng": 139.7798},
    "NRT": {"name": "東京(成田)", "lat": 35.7720, "lng": 140.3929},
    "ITM": {"name": "大阪(伊丹)", "lat": 34.7855, "lng": 135.4382},
    "KIX": {"name": "大阪(関西)", "lat": 34.4320, "lng": 135.2304},
    "NGO": {"name": "名古屋(中部)", "lat": 34.8584, "lng": 136.8054},
    "CTS": {"name": "札幌(新千歳)", "lat": 42.7752, "lng": 141.6923},
    "OKD": {"name": "札幌(丘珠)", "lat": 43.1113, "lng": 141.3802},
    "FUK": {"name": "福岡", "lat": 33.5859, "lng": 130.4507},
    "OKA": {"name": "沖縄(那覇)", "lat": 26.1958, "lng": 127.6459},
    
    # Hokkaido
    "HKD": {"name": "函館", "lat": 41.7770, "lng": 140.8243},
    "AKJ": {"name": "旭川", "lat": 43.6708, "lng": 142.4475},
    "OBO": {"name": "帯広", "lat": 42.7332, "lng": 143.2173},
    "KUH": {"name": "釧路", "lat": 43.0407, "lng": 144.1932},
    "MMB": {"name": "女満別", "lat": 43.8805, "lng": 144.1633},
    "RIS": {"name": "利尻", "lat": 45.2421, "lng": 141.1121},
    "OIR": {"name": "奥尻", "lat": 42.0736, "lng": 139.4290},
    "SHB": {"name": "中標津", "lat": 43.5775, "lng": 144.9599},
    
    # Tohoku
    "AOJ": {"name": "青森", "lat": 40.7397, "lng": 140.6901},
    "MSJ": {"name": "三沢", "lat": 40.7046, "lng": 141.3683},
    "AXT": {"name": "秋田", "lat": 39.6156, "lng": 140.2186},
    "HNA": {"name": "花巻", "lat": 39.4287, "lng": 141.1368},
    "GAJ": {"name": "山形", "lat": 38.4119, "lng": 140.3711},
    "SDJ": {"name": "仙台", "lat": 38.1397, "lng": 140.9169},
    
    # Kanto / Chubu
    "KIJ": {"name": "新潟", "lat": 37.9558, "lng": 139.1132},
    "KMQ": {"name": "小松", "lat": 36.3953, "lng": 136.4076},
    "MMJ": {"name": "松本", "lat": 36.1666, "lng": 136.9236},
    
    # Kansai
    "SHM": {"name": "南紀白浜", "lat": 33.6620, "lng": 135.3619},
    "TJH": {"name": "但馬", "lat": 35.5134, "lng": 134.7865},
    
    # Chugoku
    "OKJ": {"name": "岡山", "lat": 34.7573, "lng": 133.8554},
    "HIJ": {"name": "広島", "lat": 34.4361, "lng": 132.9195},
    "UBJ": {"name": "山口宇部", "lat": 33.9304, "lng": 131.2787},
    "IZO": {"name": "出雲", "lat": 35.4136, "lng": 132.8893},
    "OKI": {"name": "隠岐", "lat": 36.1804, "lng": 133.3245},
    
    # Shikoku
    "TKS": {"name": "徳島", "lat": 34.1328, "lng": 134.6065},
    "TAK": {"name": "高松", "lat": 34.2144, "lng": 134.0155},
    "KCZ": {"name": "高知", "lat": 33.5461, "lng": 133.6695},
    "MYJ": {"name": "松山", "lat": 33.8271, "lng": 132.7001},
    
    # Kyushu
    "KKJ": {"name": "北九州", "lat": 33.8456, "lng": 130.9660},
    "NGS": {"name": "長崎", "lat": 32.9169, "lng": 129.9136},
    "OIT": {"name": "大分", "lat": 33.4795, "lng": 131.7341},
    "KMJ": {"name": "熊本", "lat": 32.8373, "lng": 130.8580},
    "KMI": {"name": "宮崎", "lat": 31.8771, "lng": 131.4486},
    "KOJ": {"name": "鹿児島", "lat": 31.8034, "lng": 130.7188},
    
    # Kagoshima Islands (JAC)
    "TNE": {"name": "種子島", "lat": 30.6050, "lng": 130.9904},
    "KUM": {"name": "屋久島", "lat": 30.3846, "lng": 130.6596},
    "KKX": {"name": "喜界島", "lat": 28.3195, "lng": 129.9276},
    "ASJ": {"name": "奄美大島", "lat": 28.4306, "lng": 129.7126},
    "TKN": {"name": "徳之島", "lat": 27.8360, "lng": 128.8810},
    "OKE": {"name": "沖永良部", "lat": 27.4312, "lng": 128.6015},
    "RNJ": {"name": "与論", "lat": 27.0436, "lng": 128.4018},
    
    # Okinawa Islands (JTA / RAC)
    "UEO": {"name": "久米島", "lat": 26.3639, "lng": 126.7128},
    "MMY": {"name": "宮古", "lat": 24.7828, "lng": 125.2950},
    "TRA": {"name": "多良間", "lat": 24.6534, "lng": 124.6738},
    "ISG": {"name": "石垣", "lat": 24.3963, "lng": 124.2450},
    "OGN": {"name": "与那国", "lat": 24.4682, "lng": 122.9774},
    "KTD": {"name": "北大東", "lat": 25.9450, "lng": 131.3283},
    "MMD": {"name": "南大東", "lat": 25.8286, "lng": 131.2636},
}

routes = [
    # Haneda (HND)
    ("HND", "CTS"), ("HND", "HKD"), ("HND", "AKJ"), ("HND", "OBO"), ("HND", "KUH"), ("HND", "MMB"),
    ("HND", "AOJ"), ("HND", "MSJ"), ("HND", "AXT"), ("HND", "GAJ"), 
    ("HND", "KMQ"), ("HND", "NGO"), ("HND", "ITM"), ("HND", "KIX"), ("HND", "SHM"),
    ("HND", "OKJ"), ("HND", "HIJ"), ("HND", "UBJ"), ("HND", "IZO"),
    ("HND", "TKS"), ("HND", "TAK"), ("HND", "KCZ"), ("HND", "MYJ"),
    ("HND", "FUK"), ("HND", "KKJ"), ("HND", "OIT"), ("HND", "NGS"), ("HND", "KMJ"), ("HND", "KMI"), ("HND", "KOJ"),
    ("HND", "ASJ"), ("HND", "OKA"), ("HND", "MMY"), ("HND", "ISG"), ("HND", "UEO"),
    
    # Itami (ITM)
    ("ITM", "CTS"), ("ITM", "HKD"), ("ITM", "MMB"),
    ("ITM", "AOJ"), ("ITM", "MSJ"), ("ITM", "AXT"), ("ITM", "HNA"), ("ITM", "GAJ"), ("ITM", "SDJ"),
    ("ITM", "KIJ"), ("ITM", "MMJ"), ("ITM", "TJH"),
    ("ITM", "IZO"), ("ITM", "OKI"), ("ITM", "MYJ"),
    ("ITM", "FUK"), ("ITM", "NGS"), ("ITM", "OIT"), ("ITM", "KMJ"), ("ITM", "KMI"), ("ITM", "KOJ"),
    ("ITM", "ASJ"), ("ITM", "TNE"), ("ITM", "OKA"),
    
    # Kansai / Chubu (KIX / NGO)
    ("KIX", "CTS"), ("KIX", "OKA"), ("KIX", "ISG"), ("KIX", "MMY"),
    ("NGO", "CTS"), ("NGO", "OKA"), ("NGO", "MMY"), ("NGO", "ISG"),
    
    # Sapporo (CTS / OKD)
    ("CTS", "AOJ"), ("CTS", "HNA"), ("CTS", "SDJ"), ("CTS", "KIJ"), ("CTS", "HIJ"), ("CTS", "IZO"), ("CTS", "FUK"),
    ("OKD", "HKD"), ("OKD", "KUH"), ("OKD", "MMB"), ("OKD", "RIS"), ("OKD", "OIR"), ("OKD", "SHB"), ("OKD", "MSJ"), ("OKD", "AXT"),
    
    # Fukuoka (FUK)
    ("FUK", "CTS"), ("FUK", "SDJ"), ("FUK", "KIJ"), ("FUK", "HNA"), ("FUK", "IZO"), 
    ("FUK", "TKS"), ("FUK", "KCZ"), ("FUK", "MYJ"), ("FUK", "KMI"), ("FUK", "KOJ"),
    ("FUK", "ASJ"), ("FUK", "OKA"), ("FUK", "ISG"),
    
    # Kagoshima (KOJ) and Amami (ASJ)
    ("KOJ", "MYJ"), ("KOJ", "TNE"), ("KOJ", "KUM"), ("KOJ", "KKX"), ("KOJ", "ASJ"), ("KOJ", "TKN"), ("KOJ", "OKE"), ("KOJ", "RNJ"),
    ("ASJ", "OKA"), ("ASJ", "KKX"), ("ASJ", "TKN"), ("TKN", "OKE"), ("OKE", "RNJ"), ("RNJ", "OKA"),
    
    # Okinawa (OKA)
    ("OKA", "OKJ"), ("OKA", "KMQ"),
    ("OKA", "UEO"), ("OKA", "MMY"), ("OKA", "ISG"), ("OKA", "OGN"), ("OKA", "KTD"), ("OKA", "MMD"),
    ("MMY", "TRA"), ("ISG", "OGN"), ("KTD", "MMD")
]

# Ensure routes are bidirectional
all_routes = set()
for route in routes:
    src, dst = route
    all_routes.add((src, dst))
    all_routes.add((dst, src))

airports_list = []
for code, data in airports_data.items():
    # Find all connections
    connections = [dst for (src, dst) in all_routes if src == code]
    
    # Only include airports that have at least one connection
    if len(connections) > 0:
        airports_list.append({
            "code": code,
            "name": data["name"],
            "lat": data["lat"],
            "lng": data["lng"],
            "connections": sorted(connections)
        })

js_content = f"export const airports = {json.dumps(airports_list, ensure_ascii=False, indent=2)};\n"

with open('src/data/airports.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated {len(airports_list)} airports with full JAL group accurate routing.")
