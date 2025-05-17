export interface PantoneColor {
  name: string;
  hex: string;
  pantoneCode?: string;
  year?: number;
}

export interface PantoneCollection {
  name: string;
  description: string;
  colors: PantoneColor[];
}

// Complete Pantone color collections
export const pantoneCollections: PantoneCollection[] = [
  {
    name: "Color of the Year",
    description: "Pantone Colors of the Year from 2010-2024",
    colors: [
      { name: "Peach Fuzz", hex: "#FFBE98", pantoneCode: "PANTONE 13-1023", year: 2024 },
      { name: "Viva Magenta", hex: "#BB2649", pantoneCode: "PANTONE 18-1750", year: 2023 },
      { name: "Very Peri", hex: "#6667AB", pantoneCode: "PANTONE 17-3938", year: 2022 },
      { name: "Ultimate Gray", hex: "#939597", pantoneCode: "PANTONE 17-5104", year: 2021 },
      { name: "Illuminating", hex: "#F5DF4D", pantoneCode: "PANTONE 13-0647", year: 2021 },
      { name: "Classic Blue", hex: "#0F4C81", pantoneCode: "PANTONE 19-4052", year: 2020 },
      { name: "Living Coral", hex: "#FF6F61", pantoneCode: "PANTONE 16-1546", year: 2019 },
      { name: "Ultra Violet", hex: "#5F4B8B", pantoneCode: "PANTONE 18-3838", year: 2018 },
      { name: "Greenery", hex: "#88B04B", pantoneCode: "PANTONE 15-0343", year: 2017 },
      { name: "Rose Quartz", hex: "#F7CAC9", pantoneCode: "PANTONE 13-1520", year: 2016 },
      { name: "Serenity", hex: "#92A8D1", pantoneCode: "PANTONE 15-3919", year: 2016 },
      { name: "Marsala", hex: "#955251", pantoneCode: "PANTONE 18-1438", year: 2015 },
      { name: "Radiant Orchid", hex: "#B163A3", pantoneCode: "PANTONE 18-3224", year: 2014 },
      { name: "Emerald", hex: "#009473", pantoneCode: "PANTONE 17-5641", year: 2013 },
      { name: "Tangerine Tango", hex: "#DD4124", pantoneCode: "PANTONE 17-1463", year: 2012 },
      { name: "Honeysuckle", hex: "#D94F70", pantoneCode: "PANTONE 18-2120", year: 2011 },
      { name: "Turquoise", hex: "#45B5AA", pantoneCode: "PANTONE 15-5519", year: 2010 }
    ]
  },
  {
    name: "Pantone Metallics Coated",
    description: "Pantone Metallics Solid Coated color collection",
    colors: [
      { name: "PANTONE 871 C", hex: "#8C7842", pantoneCode: "871 C" },
      { name: "PANTONE 872 C", hex: "#AB9C5F", pantoneCode: "872 C" },
      { name: "PANTONE 873 C", hex: "#BBA666", pantoneCode: "873 C" },
      { name: "PANTONE 874 C", hex: "#DBC69F", pantoneCode: "874 C" },
      { name: "PANTONE 875 C", hex: "#896A3C", pantoneCode: "875 C" },
      { name: "PANTONE 876 C", hex: "#7D5740", pantoneCode: "876 C" },
      { name: "PANTONE 877 C", hex: "#8B8C8E", pantoneCode: "877 C" },
      { name: "PANTONE 8001 C", hex: "#CEBC00", pantoneCode: "8001 C" },
      { name: "PANTONE 8002 C", hex: "#A88054", pantoneCode: "8002 C" },
      { name: "PANTONE 8003 C", hex: "#875E43", pantoneCode: "8003 C" },
      { name: "PANTONE 8004 C", hex: "#694B40", pantoneCode: "8004 C" },
      { name: "PANTONE 8005 C", hex: "#5F484B", pantoneCode: "8005 C" },
      { name: "PANTONE 8006 C", hex: "#8E492F", pantoneCode: "8006 C" },
      { name: "PANTONE 8007 C", hex: "#6B3C1F", pantoneCode: "8007 C" },
      { name: "PANTONE 8008 C", hex: "#8B581C", pantoneCode: "8008 C" },
      { name: "PANTONE 8009 C", hex: "#914200", pantoneCode: "8009 C" },
      { name: "PANTONE 8100 C", hex: "#CDBD00", pantoneCode: "8100 C" },
      { name: "PANTONE 8200 C", hex: "#CAB125", pantoneCode: "8200 C" },
      { name: "PANTONE 8281 C", hex: "#6C8942", pantoneCode: "8281 C" },
      { name: "PANTONE 8282 C", hex: "#00846B", pantoneCode: "8282 C" }
    ]
  },
  {
    name: "Pantone Pastels Coated",
    description: "Pantone Pastels & Neons Coated collection",
    colors: [
      { name: "PANTONE 9020 C", hex: "#DBCC9D", pantoneCode: "9020 C" },
      { name: "PANTONE 9021 C", hex: "#EDDF73", pantoneCode: "9021 C" },
      { name: "PANTONE 9022 C", hex: "#F3E66D", pantoneCode: "9022 C" },
      { name: "PANTONE 9023 C", hex: "#EBE496", pantoneCode: "9023 C" },
      { name: "PANTONE 9024 C", hex: "#F4ED9E", pantoneCode: "9024 C" },
      { name: "PANTONE 9040 C", hex: "#F5E1A4", pantoneCode: "9040 C" },
      { name: "PANTONE 9041 C", hex: "#FBDC6E", pantoneCode: "9041 C" },
      { name: "PANTONE 9042 C", hex: "#FBCD59", pantoneCode: "9042 C" },
      { name: "PANTONE 9043 C", hex: "#FDDA97", pantoneCode: "9043 C" },
      { name: "PANTONE 9044 C", hex: "#FAE6BE", pantoneCode: "9044 C" },
      { name: "PANTONE 9060 C", hex: "#FBD3AD", pantoneCode: "9060 C" },
      { name: "PANTONE 9061 C", hex: "#FDC08E", pantoneCode: "9061 C" },
      { name: "PANTONE 9062 C", hex: "#FDB07C", pantoneCode: "9062 C" },
      { name: "PANTONE 9063 C", hex: "#FCC89F", pantoneCode: "9063 C" },
      { name: "PANTONE 9064 C", hex: "#FBDCC4", pantoneCode: "9064 C" },
      { name: "PANTONE 9080 C", hex: "#F6C4B2", pantoneCode: "9080 C" },
      { name: "PANTONE 9081 C", hex: "#F5AC96", pantoneCode: "9081 C" },
      { name: "PANTONE 9082 C", hex: "#F69679", pantoneCode: "9082 C" },
      { name: "PANTONE 9083 C", hex: "#F7AA9B", pantoneCode: "9083 C" },
      { name: "PANTONE 9084 C", hex: "#F7C3BC", pantoneCode: "9084 C" }
    ]
  },
  {
    name: "Pantone Pastels Uncoated",
    description: "Pantone Pastels & Neons Uncoated collection",
    colors: [
      { name: "PANTONE 9120 U", hex: "#DACF9C", pantoneCode: "9120 U" },
      { name: "PANTONE 9121 U", hex: "#E7D970", pantoneCode: "9121 U" },
      { name: "PANTONE 9122 U", hex: "#ECE16D", pantoneCode: "9122 U" },
      { name: "PANTONE 9123 U", hex: "#E7E091", pantoneCode: "9123 U" },
      { name: "PANTONE 9124 U", hex: "#EEE99A", pantoneCode: "9124 U" },
      { name: "PANTONE 9140 U", hex: "#EEDEA0", pantoneCode: "9140 U" },
      { name: "PANTONE 9141 U", hex: "#F4D76B", pantoneCode: "9141 U" },
      { name: "PANTONE 9142 U", hex: "#F4CA59", pantoneCode: "9142 U" },
      { name: "PANTONE 9143 U", hex: "#F6D694", pantoneCode: "9143 U" },
      { name: "PANTONE 9144 U", hex: "#F3E2B9", pantoneCode: "9144 U" },
      { name: "PANTONE 9160 U", hex: "#F4CFA9", pantoneCode: "9160 U" },
      { name: "PANTONE 9161 U", hex: "#F5BB8A", pantoneCode: "9161 U" },
      { name: "PANTONE 9162 U", hex: "#F5AB79", pantoneCode: "9162 U" },
      { name: "PANTONE 9163 U", hex: "#F5C49B", pantoneCode: "9163 U" },
      { name: "PANTONE 9164 U", hex: "#F5D7C0", pantoneCode: "9164 U" },
      { name: "PANTONE 9180 U", hex: "#EFC0AF", pantoneCode: "9180 U" },
      { name: "PANTONE 9181 U", hex: "#EEA894", pantoneCode: "9181 U" },
      { name: "PANTONE 9182 U", hex: "#EF9278", pantoneCode: "9182 U" },
      { name: "PANTONE 9183 U", hex: "#F0A698", pantoneCode: "9183 U" },
      { name: "PANTONE 9184 U", hex: "#F0BFB8", pantoneCode: "9184 U" }
    ]
  },
  {
    name: "Pantone 2025",
    description: "Pantone color collection for 2025",
    colors: [
      { name: "Apricot Crush", hex: "#FBAA7D", pantoneCode: "PANTONE 16-1341", year: 2025 },
      { name: "Twilight Mauve", hex: "#9A7BA0", pantoneCode: "PANTONE 17-3617", year: 2025 },
      { name: "Aqua Flow", hex: "#85CCCF", pantoneCode: "PANTONE 14-4714", year: 2025 },
      { name: "Verdant Green", hex: "#48A36D", pantoneCode: "PANTONE 16-6216", year: 2025 },
      { name: "Golden Hour", hex: "#EDBA4F", pantoneCode: "PANTONE 14-1051", year: 2025 },
      { name: "Rustic Clay", hex: "#A5562F", pantoneCode: "PANTONE 17-1340", year: 2025 },
      { name: "Lavender Aura", hex: "#D6B7DA", pantoneCode: "PANTONE 14-3207", year: 2025 },
      { name: "Ocean Depths", hex: "#1E5B6E", pantoneCode: "PANTONE 19-4526", year: 2025 },
      { name: "Digital Blue", hex: "#4D97FF", pantoneCode: "PANTONE 15-3935", year: 2025 },
      { name: "Earth Embrace", hex: "#8D7361", pantoneCode: "PANTONE 18-1022", year: 2025 }
    ]
  },
  {
    name: "Pantone 2024",
    description: "Pantone color collection for 2024",
    colors: [
      { name: "Peach Fuzz", hex: "#FFBE98", pantoneCode: "PANTONE 13-1023", year: 2024 },
      { name: "Plein Air", hex: "#BACAE0", pantoneCode: "PANTONE 14-4110", year: 2024 },
      { name: "Abundant Green", hex: "#31513F", pantoneCode: "PANTONE 19-6110", year: 2024 },
      { name: "Latte", hex: "#C7B69D", pantoneCode: "PANTONE 15-1116", year: 2024 },
      { name: "Pastel Turquoise", hex: "#70D1C8", pantoneCode: "PANTONE 13-5313", year: 2024 },
      { name: "Coral Reef", hex: "#FA5E4B", pantoneCode: "PANTONE 16-1546", year: 2024 },
      { name: "Provence", hex: "#689DCD", pantoneCode: "PANTONE 16-4032", year: 2024 },
      { name: "Persimmon", hex: "#FE7C52", pantoneCode: "PANTONE 16-1328", year: 2024 },
      { name: "Midnight Navy", hex: "#2D3142", pantoneCode: "PANTONE 19-3940", year: 2024 },
      { name: "Baby's Breath", hex: "#F3EEE7", pantoneCode: "PANTONE 11-0602", year: 2024 }
    ]
  },
  {
    name: "Pantone 2023",
    description: "Pantone color collection for 2023",
    colors: [
      { name: "Viva Magenta", hex: "#BB2649", pantoneCode: "PANTONE 18-1750", year: 2023 },
      { name: "Fiery Red", hex: "#D12631", pantoneCode: "PANTONE 18-1664", year: 2023 },
      { name: "Rose Violet", hex: "#C0428A", pantoneCode: "PANTONE 17-2520", year: 2023 },
      { name: "Pale Lilac", hex: "#DCD1E8", pantoneCode: "PANTONE 13-3820", year: 2023 },
      { name: "Blue Perennial", hex: "#447D91", pantoneCode: "PANTONE 18-4728", year: 2023 },
      { name: "Skylight", hex: "#5BC9E7", pantoneCode: "PANTONE 14-4318", year: 2023 },
      { name: "Tranquil Blue", hex: "#9DDBE6", pantoneCode: "PANTONE 13-4720", year: 2023 },
      { name: "Campos de Carioca", hex: "#89C75F", pantoneCode: "PANTONE 15-6437", year: 2023 },
      { name: "Mineral Green", hex: "#4B937F", pantoneCode: "PANTONE 17-5430", year: 2023 },
      { name: "Conch Shell", hex: "#E3BFAE", pantoneCode: "PANTONE 13-1019", year: 2023 },
      { name: "Tangelo", hex: "#DF744A", pantoneCode: "PANTONE 16-1340", year: 2023 },
      { name: "Peach Fuzz", hex: "#FFBE98", pantoneCode: "PANTONE 13-1023", year: 2023 },
      { name: "Sun Orange", hex: "#EC8B32", pantoneCode: "PANTONE 15-1335", year: 2023 },
      { name: "Quiet Shade", hex: "#63666A", pantoneCode: "PANTONE 18-0510", year: 2023 },
      { name: "Vanilla Cream", hex: "#F0DFB5", pantoneCode: "PANTONE 12-0713", year: 2023 }
    ]
  },
  {
    name: "Pantone 2022",
    description: "Pantone color collection for 2022",
    colors: [
      { name: "Very Peri", hex: "#6667AB", pantoneCode: "PANTONE 17-3938", year: 2022 },
      { name: "Gossamer Pink", hex: "#FEC5BB", pantoneCode: "PANTONE 13-1513", year: 2022 },
      { name: "Innuendo", hex: "#D94C54", pantoneCode: "PANTONE 18-1564", year: 2022 },
      { name: "Spun Sugar", hex: "#BFACE0", pantoneCode: "PANTONE 14-3207", year: 2022 },
      { name: "Northern Droplet", hex: "#D7E4C0", pantoneCode: "PANTONE 13-0219", year: 2022 },
      { name: "Cascade", hex: "#93B4B0", pantoneCode: "PANTONE 15-5217", year: 2022 },
      { name: "Dahlia", hex: "#97572B", pantoneCode: "PANTONE 18-1448", year: 2022 },
      { name: "Poinciana", hex: "#BA3A1C", pantoneCode: "PANTONE 18-1564", year: 2022 },
      { name: "Granite Green", hex: "#86A29A", pantoneCode: "PANTONE 16-5907", year: 2022 },
      { name: "Coca Mocha", hex: "#9F8B76", pantoneCode: "PANTONE 16-1324", year: 2022 }
    ]
  },
  {
    name: "Pantone Solid Coated",
    description: "Pantone Solid Coated color collection (V4)",
    colors: [
      { name: "PANTONE 100 C", hex: "#F4ED7C", pantoneCode: "100 C" },
      { name: "PANTONE 101 C", hex: "#F4ED47", pantoneCode: "101 C" },
      { name: "PANTONE 102 C", hex: "#F9E814", pantoneCode: "102 C" },
      { name: "PANTONE 103 C", hex: "#C6AD0F", pantoneCode: "103 C" },
      { name: "PANTONE 104 C", hex: "#AD9B0C", pantoneCode: "104 C" },
      { name: "PANTONE 105 C", hex: "#82750F", pantoneCode: "105 C" },
      { name: "PANTONE 106 C", hex: "#F7E859", pantoneCode: "106 C" },
      { name: "PANTONE 107 C", hex: "#F9E526", pantoneCode: "107 C" },
      { name: "PANTONE 108 C", hex: "#FEDB00", pantoneCode: "108 C" },
      { name: "PANTONE 109 C", hex: "#FFCD00", pantoneCode: "109 C" },
      { name: "PANTONE 110 C", hex: "#D5B000", pantoneCode: "110 C" },
      { name: "PANTONE 111 C", hex: "#AA8A00", pantoneCode: "111 C" },
      { name: "PANTONE 112 C", hex: "#7F6600", pantoneCode: "112 C" },
      { name: "PANTONE 113 C", hex: "#FADA5E", pantoneCode: "113 C" },
      { name: "PANTONE 114 C", hex: "#FED629", pantoneCode: "114 C" },
      { name: "PANTONE 115 C", hex: "#FFC600", pantoneCode: "115 C" },
      { name: "PANTONE 116 C", hex: "#FFBF00", pantoneCode: "116 C" },
      { name: "PANTONE 117 C", hex: "#C69214", pantoneCode: "117 C" },
      { name: "PANTONE 118 C", hex: "#A07400", pantoneCode: "118 C" },
      { name: "PANTONE 119 C", hex: "#6C4F00", pantoneCode: "119 C" }
    ]
  },
  {
    name: "Pantone Solid Uncoated",
    description: "Pantone Solid Uncoated color collection (V4)",
    colors: [
      { name: "PANTONE 100 U", hex: "#F1EB79", pantoneCode: "100 U" },
      { name: "PANTONE 101 U", hex: "#F1EA45", pantoneCode: "101 U" },
      { name: "PANTONE 102 U", hex: "#F4E300", pantoneCode: "102 U" },
      { name: "PANTONE 103 U", hex: "#C5AC09", pantoneCode: "103 U" },
      { name: "PANTONE 104 U", hex: "#AC9901", pantoneCode: "104 U" },
      { name: "PANTONE 105 U", hex: "#84770F", pantoneCode: "105 U" },
      { name: "PANTONE 106 U", hex: "#F4E356", pantoneCode: "106 U" },
      { name: "PANTONE 107 U", hex: "#F4E113", pantoneCode: "107 U" },
      { name: "PANTONE 108 U", hex: "#F8D800", pantoneCode: "108 U" },
      { name: "PANTONE 109 U", hex: "#FFCC00", pantoneCode: "109 U" },
      { name: "PANTONE 110 U", hex: "#D4AE00", pantoneCode: "110 U" },
      { name: "PANTONE 111 U", hex: "#A78C00", pantoneCode: "111 U" },
      { name: "PANTONE 112 U", hex: "#7C6600", pantoneCode: "112 U" },
      { name: "PANTONE 113 U", hex: "#F7D656", pantoneCode: "113 U" },
      { name: "PANTONE 114 U", hex: "#F9D616", pantoneCode: "114 U" },
      { name: "PANTONE 115 U", hex: "#FFC90E", pantoneCode: "115 U" },
      { name: "PANTONE 116 U", hex: "#FFC706", pantoneCode: "116 U" },
      { name: "PANTONE 117 U", hex: "#C49003", pantoneCode: "117 U" },
      { name: "PANTONE 118 U", hex: "#9C7100", pantoneCode: "118 U" },
      { name: "PANTONE 119 U", hex: "#654B00", pantoneCode: "119 U" }
    ]
  },
  {
    name: "Basic",
    description: "Common colors that work well in both dark and light themes",
    colors: [
      { name: "Black", hex: "#000000", pantoneCode: "Process Black" },
      { name: "White", hex: "#FFFFFF", pantoneCode: "Process White" },
      { name: "Red", hex: "#FF0000", pantoneCode: "Bright Red" },
      { name: "Green", hex: "#00FF00", pantoneCode: "Bright Green" },
      { name: "Blue", hex: "#0000FF", pantoneCode: "Reflex Blue" },
      { name: "Yellow", hex: "#FFFF00", pantoneCode: "Process Yellow" },
      { name: "Cyan", hex: "#00FFFF", pantoneCode: "Process Cyan" },
      { name: "Magenta", hex: "#FF00FF", pantoneCode: "Process Magenta" },
      { name: "Gray", hex: "#808080", pantoneCode: "Cool Gray 7" },
      { name: "Silver", hex: "#C0C0C0", pantoneCode: "Cool Gray 4" },
      { name: "Maroon", hex: "#800000", pantoneCode: "491" },
      { name: "Olive", hex: "#808000", pantoneCode: "398" },
      { name: "Navy", hex: "#000080", pantoneCode: "282" },
      { name: "Purple", hex: "#800080", pantoneCode: "2607" },
      { name: "Teal", hex: "#008080", pantoneCode: "321" },
      { name: "Orange", hex: "#FFA500", pantoneCode: "137" }
    ]
  }
];

// Function to find a pantone color by hex
export const findPantoneColorByHex = (hex: string): PantoneColor | undefined => {
  const normalizedHex = hex.toUpperCase();
  
  for (const collection of pantoneCollections) {
    const found = collection.colors.find(
      color => color.hex.toUpperCase() === normalizedHex
    );
    if (found) return found;
  }
  
  return undefined;
};

// Function to search pantone colors by name or hex
export const searchPantoneColors = (searchTerm: string): PantoneColor[] => {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  const results: PantoneColor[] = [];
  
  for (const collection of pantoneCollections) {
    const matches = collection.colors.filter(
      color => 
        color.name.toLowerCase().includes(normalizedSearchTerm) ||
        color.hex.toLowerCase().includes(normalizedSearchTerm) ||
        (color.pantoneCode && color.pantoneCode.toLowerCase().includes(normalizedSearchTerm))
    );
    results.push(...matches);
  }
  
  return results;
};