"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
test('Performance 2 - Bug fix from 31st Jan 2022', function () {
    var state = {
        "players": {
            "MINT🍫#2662": {
                "id": "MINT🍫#2662",
                "name": "MINT🍫#2662",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 1
            },
            "Solution999": {
                "id": "Solution999",
                "name": "Solution999",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 2
            },
            "Luther702": {
                "id": "Luther702",
                "name": "Luther702",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 3
            },
            "DimK": {
                "id": "DimK",
                "name": "DimK",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 4
            },
            "Subaru |Rebels": {
                "id": "Subaru |Rebels",
                "name": "Subaru |Rebels",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 5
            },
            "Grillongle": {
                "id": "Grillongle",
                "name": "Grillongle",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 6
            },
            "Paixao #3890": {
                "id": "Paixao #3890",
                "name": "Paixao #3890",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 7
            },
            "Salpo106": {
                "id": "Salpo106",
                "name": "Salpo106",
                "currentTable": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "movements": 0,
                "seat": 8
            },
            "Solcrystal#964": {
                "id": "Solcrystal#964",
                "name": "Solcrystal#964",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 1
            },
            "yorong#2388": {
                "id": "yorong#2388",
                "name": "yorong#2388",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 2
            },
            "l2gs#3944": {
                "id": "l2gs#3944",
                "name": "l2gs#3944",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 3
            },
            "emilbochnik": {
                "id": "emilbochnik",
                "name": "emilbochnik",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 4
            },
            "Nit#3912": {
                "id": "Nit#3912",
                "name": "Nit#3912",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 5
            },
            "Neon482000": {
                "id": "Neon482000",
                "name": "Neon482000",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 6
            },
            "Ihave2GME": {
                "id": "Ihave2GME",
                "name": "Ihave2GME",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 7
            },
            "Donfckundo": {
                "id": "Donfckundo",
                "name": "Donfckundo",
                "currentTable": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "movements": 0,
                "seat": 8
            },
            "Ebro88": {
                "id": "Ebro88",
                "name": "Ebro88",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 1
            },
            "Shentpup": {
                "id": "Shentpup",
                "name": "Shentpup",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 2
            },
            "Pepdagoat": {
                "id": "Pepdagoat",
                "name": "Pepdagoat",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 3
            },
            "nft_thor#9690": {
                "id": "nft_thor#9690",
                "name": "nft_thor#9690",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 4
            },
            "Kuma#6027": {
                "id": "Kuma#6027",
                "name": "Kuma#6027",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 6
            },
            "Batman | BAPES": {
                "id": "Batman | BAPES",
                "name": "Batman | BAPES",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 7
            },
            "Ahno": {
                "id": "Ahno",
                "name": "Ahno",
                "currentTable": "uKQafFLfBsulSU9MPcTb5PouY",
                "movements": 0,
                "seat": 8
            },
            "CryptoJoe1313": {
                "id": "CryptoJoe1313",
                "name": "CryptoJoe1313",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 1
            },
            "Aaron |": {
                "id": "Aaron |",
                "name": "Aaron |",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 2
            },
            "SportinG": {
                "id": "SportinG",
                "name": "SportinG",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 3
            },
            "DTX": {
                "id": "DTX",
                "name": "DTX",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 4
            },
            "SkyDoge | Soul": {
                "id": "SkyDoge | Soul",
                "name": "SkyDoge | Soul",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 5
            },
            "Vjallin": {
                "id": "Vjallin",
                "name": "Vjallin",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 6
            },
            "Max Thomas": {
                "id": "Max Thomas",
                "name": "Max Thomas",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 7
            },
            "Kluex #8556": {
                "id": "Kluex #8556",
                "name": "Kluex #8556",
                "currentTable": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "movements": 0,
                "seat": 8
            },
            "MoZaK2K": {
                "id": "MoZaK2K",
                "name": "MoZaK2K",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 1
            },
            "jimpap": {
                "id": "jimpap",
                "name": "jimpap",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 2
            },
            "Tiny fear": {
                "id": "Tiny fear",
                "name": "Tiny fear",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 3
            },
            "glee": {
                "id": "glee",
                "name": "glee",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 4
            },
            "CG88": {
                "id": "CG88",
                "name": "CG88",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 5
            },
            "King Sahbee": {
                "id": "King Sahbee",
                "name": "King Sahbee",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 6
            },
            "StephMoon": {
                "id": "StephMoon",
                "name": "StephMoon",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 7
            },
            "LostBTC": {
                "id": "LostBTC",
                "name": "LostBTC",
                "currentTable": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "movements": 0,
                "seat": 8
            },
            "louk04": {
                "id": "louk04",
                "name": "louk04",
                "currentTable": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "movements": 0,
                "seat": 1
            },
            "Arthereox": {
                "id": "Arthereox",
                "name": "Arthereox",
                "currentTable": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "movements": 0,
                "seat": 2
            },
            "Amitco": {
                "id": "Amitco",
                "name": "Amitco",
                "currentTable": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "movements": 0,
                "seat": 3
            },
            "LuckyP!!!": {
                "id": "LuckyP!!!",
                "name": "LuckyP!!!",
                "currentTable": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "movements": 0,
                "seat": 5
            },
            "Strangest": {
                "id": "Strangest",
                "name": "Strangest",
                "currentTable": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "movements": 0,
                "seat": 6
            },
            "Miloute": {
                "id": "Miloute",
                "name": "Miloute",
                "currentTable": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "movements": 0,
                "seat": 7
            },
            "theSOLhoe": {
                "id": "theSOLhoe",
                "name": "theSOLhoe",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 1
            },
            "HangLooseRette": {
                "id": "HangLooseRette",
                "name": "HangLooseRette",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 2
            },
            "Kezutan": {
                "id": "Kezutan",
                "name": "Kezutan",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 3
            },
            "BenDover99": {
                "id": "BenDover99",
                "name": "BenDover99",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 4
            },
            "Maruc": {
                "id": "Maruc",
                "name": "Maruc",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 5
            },
            "goldieshdash": {
                "id": "goldieshdash",
                "name": "goldieshdash",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 6
            },
            "JeromieRomie02": {
                "id": "JeromieRomie02",
                "name": "JeromieRomie02",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 7
            },
            "suppercious": {
                "id": "suppercious",
                "name": "suppercious",
                "currentTable": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "movements": 0,
                "seat": 8
            },
            "Shadowfart8136": {
                "id": "Shadowfart8136",
                "name": "Shadowfart8136",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 1
            },
            "Kuora": {
                "id": "Kuora",
                "name": "Kuora",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 2
            },
            "Shreks#8141": {
                "id": "Shreks#8141",
                "name": "Shreks#8141",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 3
            },
            "prodbyzander": {
                "id": "prodbyzander",
                "name": "prodbyzander",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 4
            },
            "WenRare": {
                "id": "WenRare",
                "name": "WenRare",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 5
            },
            "heretovin": {
                "id": "heretovin",
                "name": "heretovin",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 6
            },
            "upsAder": {
                "id": "upsAder",
                "name": "upsAder",
                "currentTable": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "movements": 0,
                "seat": 7
            },
            "TillOneMill": {
                "id": "TillOneMill",
                "name": "TillOneMill",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 1
            },
            "Cryptofunk": {
                "id": "Cryptofunk",
                "name": "Cryptofunk",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 2
            },
            "turlututu": {
                "id": "turlututu",
                "name": "turlututu",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 3
            },
            "Killerqueen": {
                "id": "Killerqueen",
                "name": "Killerqueen",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 4
            },
            "Beowolf": {
                "id": "Beowolf",
                "name": "Beowolf",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 5
            },
            "Kierk": {
                "id": "Kierk",
                "name": "Kierk",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 6
            },
            "freecss": {
                "id": "freecss",
                "name": "freecss",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 7
            },
            "El Vega": {
                "id": "El Vega",
                "name": "El Vega",
                "currentTable": "aAVopWN6RFYnixf1oI6ojZa9X",
                "movements": 0,
                "seat": 8
            },
            "MrennerBorel": {
                "id": "MrennerBorel",
                "name": "MrennerBorel",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 1
            },
            "Viosil": {
                "id": "Viosil",
                "name": "Viosil",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 2
            },
            "JeremyV": {
                "id": "JeremyV",
                "name": "JeremyV",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 3
            },
            "iamburaky": {
                "id": "iamburaky",
                "name": "iamburaky",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 4
            },
            "YY10_SOL": {
                "id": "YY10_SOL",
                "name": "YY10_SOL",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 5
            },
            "NFTtradez": {
                "id": "NFTtradez",
                "name": "NFTtradez",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 6
            },
            "Nicofrosty7": {
                "id": "Nicofrosty7",
                "name": "Nicofrosty7",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 7
            },
            "Raamiana": {
                "id": "Raamiana",
                "name": "Raamiana",
                "currentTable": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "movements": 0,
                "seat": 8
            },
            "RedruM": {
                "id": "RedruM",
                "name": "RedruM",
                "currentTable": "RT36wwNrF4xX_TZHPVGO1M8a_",
                "movements": 0,
                "seat": 1
            },
            "topzzz": {
                "id": "topzzz",
                "name": "topzzz",
                "currentTable": "RT36wwNrF4xX_TZHPVGO1M8a_",
                "movements": 0,
                "seat": 2
            },
            "ThePureSoulDog": {
                "id": "ThePureSoulDog",
                "name": "ThePureSoulDog",
                "currentTable": "RT36wwNrF4xX_TZHPVGO1M8a_",
                "movements": 0,
                "seat": 3
            },
            "Staus": {
                "id": "Staus",
                "name": "Staus",
                "currentTable": "RT36wwNrF4xX_TZHPVGO1M8a_",
                "movements": 0,
                "seat": 4
            },
            "Ficky Shen": {
                "id": "Ficky Shen",
                "name": "Ficky Shen",
                "currentTable": "RT36wwNrF4xX_TZHPVGO1M8a_",
                "movements": 0,
                "seat": 6
            },
            "Puddin2010": {
                "id": "Puddin2010",
                "name": "Puddin2010",
                "currentTable": "IDQO4Fob_vuOjLNJKOlm6678s",
                "movements": 0,
                "seat": 1
            },
            "Tripwood": {
                "id": "Tripwood",
                "name": "Tripwood",
                "currentTable": "IDQO4Fob_vuOjLNJKOlm6678s",
                "movements": 0,
                "seat": 2
            },
            "Eightba11": {
                "id": "Eightba11",
                "name": "Eightba11",
                "currentTable": "IDQO4Fob_vuOjLNJKOlm6678s",
                "movements": 0,
                "seat": 3
            },
            "David 1254": {
                "id": "David 1254",
                "name": "David 1254",
                "currentTable": "IDQO4Fob_vuOjLNJKOlm6678s",
                "movements": 0,
                "seat": 5
            },
            "Tsoupoutsou": {
                "id": "Tsoupoutsou",
                "name": "Tsoupoutsou",
                "currentTable": "IDQO4Fob_vuOjLNJKOlm6678s",
                "movements": 0,
                "seat": 6
            },
            "bigscott": {
                "id": "bigscott",
                "name": "bigscott",
                "currentTable": "IDQO4Fob_vuOjLNJKOlm6678s",
                "movements": 0,
                "seat": 7
            },
            "Popel": {
                "id": "Popel",
                "name": "Popel",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 1
            },
            "shooterboy": {
                "id": "shooterboy",
                "name": "shooterboy",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 2
            },
            "Indio_Jau": {
                "id": "Indio_Jau",
                "name": "Indio_Jau",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 3
            },
            "EmmaKgLy": {
                "id": "EmmaKgLy",
                "name": "EmmaKgLy",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 4
            },
            "Phaasz": {
                "id": "Phaasz",
                "name": "Phaasz",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 5
            },
            "Wy2K | Soul do": {
                "id": "Wy2K | Soul do",
                "name": "Wy2K | Soul do",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 6
            },
            "Skoo": {
                "id": "Skoo",
                "name": "Skoo",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 7
            },
            "VasilisK": {
                "id": "VasilisK",
                "name": "VasilisK",
                "currentTable": "P-madOjG3WSxPu33ufyLDnsh1",
                "movements": 0,
                "seat": 8
            },
            "Billy Woods": {
                "id": "Billy Woods",
                "name": "Billy Woods",
                "currentTable": "WqptZCgPpS89M3dAAFFtbhDIK",
                "movements": 0,
                "seat": 2
            },
            "Aimee#7260": {
                "id": "Aimee#7260",
                "name": "Aimee#7260",
                "currentTable": "WqptZCgPpS89M3dAAFFtbhDIK",
                "movements": 0,
                "seat": 3
            },
            "FabioN": {
                "id": "FabioN",
                "name": "FabioN",
                "currentTable": "WqptZCgPpS89M3dAAFFtbhDIK",
                "movements": 0,
                "seat": 5
            },
            "BennyX": {
                "id": "BennyX",
                "name": "BennyX",
                "currentTable": "WqptZCgPpS89M3dAAFFtbhDIK",
                "movements": 0,
                "seat": 6
            },
            "Kaz#3017": {
                "id": "Kaz#3017",
                "name": "Kaz#3017",
                "currentTable": "WqptZCgPpS89M3dAAFFtbhDIK",
                "movements": 0,
                "seat": 8
            },
            "Alibaba": {
                "id": "Alibaba",
                "name": "Alibaba",
                "currentTable": "WvXG7jt85Uq-O6zgByed6TvLt",
                "movements": 0,
                "seat": 2
            },
            "Wahbart": {
                "id": "Wahbart",
                "name": "Wahbart",
                "currentTable": "WvXG7jt85Uq-O6zgByed6TvLt",
                "movements": 0,
                "seat": 4
            },
            "Tj22": {
                "id": "Tj22",
                "name": "Tj22",
                "currentTable": "WvXG7jt85Uq-O6zgByed6TvLt",
                "movements": 0,
                "seat": 5
            },
            "robinomega": {
                "id": "robinomega",
                "name": "robinomega",
                "currentTable": "WvXG7jt85Uq-O6zgByed6TvLt",
                "movements": 0,
                "seat": 6
            },
            "BlazinMitchie": {
                "id": "BlazinMitchie",
                "name": "BlazinMitchie",
                "currentTable": "WvXG7jt85Uq-O6zgByed6TvLt",
                "movements": 0,
                "seat": 8
            },
            "MCS7192": {
                "id": "MCS7192",
                "name": "MCS7192",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 1
            },
            "Coletrain": {
                "id": "Coletrain",
                "name": "Coletrain",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 2
            },
            "cammypacz": {
                "id": "cammypacz",
                "name": "cammypacz",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 3
            },
            "Prince of Keny": {
                "id": "Prince of Keny",
                "name": "Prince of Keny",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 4
            },
            "Lukas 12": {
                "id": "Lukas 12",
                "name": "Lukas 12",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 5
            },
            "jakep1999#5516": {
                "id": "jakep1999#5516",
                "name": "jakep1999#5516",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 6
            },
            "ztudorx": {
                "id": "ztudorx",
                "name": "ztudorx",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 7
            },
            "MikzNFT": {
                "id": "MikzNFT",
                "name": "MikzNFT",
                "currentTable": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "movements": 0,
                "seat": 8
            },
            "Bazzzhe": {
                "id": "Bazzzhe",
                "name": "Bazzzhe",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 1
            },
            "InsideGod#8698": {
                "id": "InsideGod#8698",
                "name": "InsideGod#8698",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 3
            },
            "GASTON": {
                "id": "GASTON",
                "name": "GASTON",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 4
            },
            "BOO_Teng27": {
                "id": "BOO_Teng27",
                "name": "BOO_Teng27",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 5
            },
            "JungleTosh": {
                "id": "JungleTosh",
                "name": "JungleTosh",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 6
            },
            "Nixon Jr": {
                "id": "Nixon Jr",
                "name": "Nixon Jr",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 7
            },
            "aka_mene | RCC": {
                "id": "aka_mene | RCC",
                "name": "aka_mene | RCC",
                "currentTable": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "movements": 0,
                "seat": 8
            },
            "Mr-Tii": {
                "id": "Mr-Tii",
                "name": "Mr-Tii",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 1
            },
            "Simdog": {
                "id": "Simdog",
                "name": "Simdog",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 2
            },
            "Gabry#8322": {
                "id": "Gabry#8322",
                "name": "Gabry#8322",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 3
            },
            "Sto1c": {
                "id": "Sto1c",
                "name": "Sto1c",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 5
            },
            "matcha_queen": {
                "id": "matcha_queen",
                "name": "matcha_queen",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 6
            },
            "Dufflebagboi": {
                "id": "Dufflebagboi",
                "name": "Dufflebagboi",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 7
            },
            "esrever": {
                "id": "esrever",
                "name": "esrever",
                "currentTable": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "movements": 0,
                "seat": 8
            },
            "ToreMinas": {
                "id": "ToreMinas",
                "name": "ToreMinas",
                "currentTable": "mhRh-13isfRSz3yXkvyJBNl05",
                "movements": 0,
                "seat": 1
            },
            "yongyanglee": {
                "id": "yongyanglee",
                "name": "yongyanglee",
                "currentTable": "mhRh-13isfRSz3yXkvyJBNl05",
                "movements": 0,
                "seat": 2
            },
            "Veritas420": {
                "id": "Veritas420",
                "name": "Veritas420",
                "currentTable": "mhRh-13isfRSz3yXkvyJBNl05",
                "movements": 0,
                "seat": 4
            },
            "JEM": {
                "id": "JEM",
                "name": "JEM",
                "currentTable": "mhRh-13isfRSz3yXkvyJBNl05",
                "movements": 0,
                "seat": 5
            },
            "Peng#4103": {
                "id": "Peng#4103",
                "name": "Peng#4103",
                "currentTable": "mhRh-13isfRSz3yXkvyJBNl05",
                "movements": 0,
                "seat": 8
            },
            "Swootey": {
                "id": "Swootey",
                "name": "Swootey",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 1
            },
            "King22": {
                "id": "King22",
                "name": "King22",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 3
            },
            "Rallan": {
                "id": "Rallan",
                "name": "Rallan",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 4
            },
            "dopor#0220": {
                "id": "dopor#0220",
                "name": "dopor#0220",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 5
            },
            "FancyPants": {
                "id": "FancyPants",
                "name": "FancyPants",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 6
            },
            "Єяяȏℛ()Ꮗꭿꮍ": {
                "id": "Єяяȏℛ()Ꮗꭿꮍ",
                "name": "Єяяȏℛ()Ꮗꭿꮍ",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 7
            },
            "Jonno007": {
                "id": "Jonno007",
                "name": "Jonno007",
                "currentTable": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "movements": 0,
                "seat": 8
            },
            "MetaGrimster": {
                "id": "MetaGrimster",
                "name": "MetaGrimster",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 1
            },
            "JSmash": {
                "id": "JSmash",
                "name": "JSmash",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 2
            },
            "Vaan21|SoulDog": {
                "id": "Vaan21|SoulDog",
                "name": "Vaan21|SoulDog",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 3
            },
            "Waldbeer": {
                "id": "Waldbeer",
                "name": "Waldbeer",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 4
            },
            "kosmoss13666": {
                "id": "kosmoss13666",
                "name": "kosmoss13666",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 5
            },
            "Joey#9908": {
                "id": "Joey#9908",
                "name": "Joey#9908",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 6
            },
            "NoBaeK": {
                "id": "NoBaeK",
                "name": "NoBaeK",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 7
            },
            "Fernando": {
                "id": "Fernando",
                "name": "Fernando",
                "currentTable": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "movements": 0,
                "seat": 8
            },
            "DapperDan": {
                "id": "DapperDan",
                "name": "DapperDan",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 1
            },
            "Sigrid": {
                "id": "Sigrid",
                "name": "Sigrid",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 2
            },
            "majcar": {
                "id": "majcar",
                "name": "majcar",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 3
            },
            "Parisiancrypto": {
                "id": "Parisiancrypto",
                "name": "Parisiancrypto",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 4
            },
            "kopif_tn": {
                "id": "kopif_tn",
                "name": "kopif_tn",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 5
            },
            "ChillxSoulDog": {
                "id": "ChillxSoulDog",
                "name": "ChillxSoulDog",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 6
            },
            "Luan Coelho": {
                "id": "Luan Coelho",
                "name": "Luan Coelho",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 7
            },
            "barcaboy": {
                "id": "barcaboy",
                "name": "barcaboy",
                "currentTable": "bnpjkywpdDgz0KkraPfcD030j",
                "movements": 0,
                "seat": 8
            },
            "Lando#8743": {
                "id": "Lando#8743",
                "name": "Lando#8743",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 2
            },
            "HodlSchool": {
                "id": "HodlSchool",
                "name": "HodlSchool",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 3
            },
            "triplecrown333": {
                "id": "triplecrown333",
                "name": "triplecrown333",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 4
            },
            "Smarty#2593": {
                "id": "Smarty#2593",
                "name": "Smarty#2593",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 5
            },
            "Strus": {
                "id": "Strus",
                "name": "Strus",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 6
            },
            "dirtyrice": {
                "id": "dirtyrice",
                "name": "dirtyrice",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 7
            },
            "Anatolii": {
                "id": "Anatolii",
                "name": "Anatolii",
                "currentTable": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "movements": 0,
                "seat": 8
            },
            "unforgivin": {
                "id": "unforgivin",
                "name": "unforgivin",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 0,
                "seat": 1
            },
            "gsus#6995": {
                "id": "gsus#6995",
                "name": "gsus#6995",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 0,
                "seat": 2
            },
            "burki": {
                "id": "burki",
                "name": "burki",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 0,
                "seat": 3
            },
            "KilleQueen": {
                "id": "KilleQueen",
                "name": "KilleQueen",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 1,
                "seat": 4
            },
            "Stef Bilzerian": {
                "id": "Stef Bilzerian",
                "name": "Stef Bilzerian",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 1,
                "seat": 5
            },
            "lellos": {
                "id": "lellos",
                "name": "lellos",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 1,
                "seat": 6
            },
            "Ochelios": {
                "id": "Ochelios",
                "name": "Ochelios",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 1,
                "seat": 7
            },
            "sweatyintern": {
                "id": "sweatyintern",
                "name": "sweatyintern",
                "currentTable": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "movements": 1,
                "seat": 8
            },
            "Beavis1234": {
                "id": "Beavis1234",
                "name": "Beavis1234",
                "currentTable": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "movements": 0,
                "seat": 1
            },
            "Gigabeat#6160": {
                "id": "Gigabeat#6160",
                "name": "Gigabeat#6160",
                "currentTable": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "movements": 0,
                "seat": 4
            },
            "Berlin": {
                "id": "Berlin",
                "name": "Berlin",
                "currentTable": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "movements": 0,
                "seat": 5
            },
            "Pokerface888": {
                "id": "Pokerface888",
                "name": "Pokerface888",
                "currentTable": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "movements": 0,
                "seat": 6
            },
            "Nand": {
                "id": "Nand",
                "name": "Nand",
                "currentTable": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "movements": 0,
                "seat": 7
            },
            "Aflak": {
                "id": "Aflak",
                "name": "Aflak",
                "currentTable": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "movements": 0,
                "seat": 8
            }
        },
        "tables": {
            "H1ySczcfxEKgnVUfDDA5C2aW7": {
                "id": "H1ySczcfxEKgnVUfDDA5C2aW7",
                "dealerButtonLastRound": 4,
                "seats": [
                    [
                        1,
                        "MINT🍫#2662"
                    ],
                    [
                        2,
                        "Solution999"
                    ],
                    [
                        3,
                        "Luther702"
                    ],
                    [
                        4,
                        "DimK"
                    ],
                    [
                        5,
                        "Subaru |Rebels"
                    ],
                    [
                        6,
                        "Grillongle"
                    ],
                    [
                        7,
                        "Paixao #3890"
                    ],
                    [
                        8,
                        "Salpo106"
                    ]
                ]
            },
            "5cTYsmFOfEN3xrV2sNifSYsUG": {
                "id": "5cTYsmFOfEN3xrV2sNifSYsUG",
                "dealerButtonLastRound": 6,
                "seats": [
                    [
                        1,
                        "Solcrystal#964"
                    ],
                    [
                        2,
                        "yorong#2388"
                    ],
                    [
                        3,
                        "l2gs#3944"
                    ],
                    [
                        4,
                        "emilbochnik"
                    ],
                    [
                        5,
                        "Nit#3912"
                    ],
                    [
                        6,
                        "Neon482000"
                    ],
                    [
                        7,
                        "Ihave2GME"
                    ],
                    [
                        8,
                        "Donfckundo"
                    ]
                ]
            },
            "uKQafFLfBsulSU9MPcTb5PouY": {
                "id": "uKQafFLfBsulSU9MPcTb5PouY",
                "dealerButtonLastRound": 2,
                "seats": [
                    [
                        1,
                        "Ebro88"
                    ],
                    [
                        2,
                        "Shentpup"
                    ],
                    [
                        3,
                        "Pepdagoat"
                    ],
                    [
                        4,
                        "nft_thor#9690"
                    ],
                    [
                        6,
                        "Kuma#6027"
                    ],
                    [
                        7,
                        "Batman | BAPES"
                    ],
                    [
                        8,
                        "Ahno"
                    ]
                ]
            },
            "qvzK4x94__3WWU6kMNRFjeuEJ": {
                "id": "qvzK4x94__3WWU6kMNRFjeuEJ",
                "dealerButtonLastRound": 7,
                "seats": [
                    [
                        1,
                        "CryptoJoe1313"
                    ],
                    [
                        2,
                        "Aaron |"
                    ],
                    [
                        3,
                        "SportinG"
                    ],
                    [
                        4,
                        "DTX"
                    ],
                    [
                        5,
                        "SkyDoge | Soul"
                    ],
                    [
                        6,
                        "Vjallin"
                    ],
                    [
                        7,
                        "Max Thomas"
                    ],
                    [
                        8,
                        "Kluex #8556"
                    ]
                ]
            },
            "lSjx7st--lH1Qkbm9KFj4YrmS": {
                "id": "lSjx7st--lH1Qkbm9KFj4YrmS",
                "dealerButtonLastRound": 7,
                "seats": [
                    [
                        1,
                        "MoZaK2K"
                    ],
                    [
                        2,
                        "jimpap"
                    ],
                    [
                        3,
                        "Tiny fear"
                    ],
                    [
                        4,
                        "glee"
                    ],
                    [
                        5,
                        "CG88"
                    ],
                    [
                        6,
                        "King Sahbee"
                    ],
                    [
                        7,
                        "StephMoon"
                    ],
                    [
                        8,
                        "LostBTC"
                    ]
                ]
            },
            "QwJPp4Rl8zBUY9Cfi9ulKS3Ky": {
                "id": "QwJPp4Rl8zBUY9Cfi9ulKS3Ky",
                "dealerButtonLastRound": 1,
                "seats": [
                    [
                        1,
                        "louk04"
                    ],
                    [
                        2,
                        "Arthereox"
                    ],
                    [
                        3,
                        "Amitco"
                    ],
                    [
                        5,
                        "LuckyP!!!"
                    ],
                    [
                        6,
                        "Strangest"
                    ],
                    [
                        7,
                        "Miloute"
                    ]
                ]
            },
            "jm2hcxBeE1iQTfmuERXeK2OpO": {
                "id": "jm2hcxBeE1iQTfmuERXeK2OpO",
                "dealerButtonLastRound": 6,
                "seats": [
                    [
                        1,
                        "theSOLhoe"
                    ],
                    [
                        2,
                        "HangLooseRette"
                    ],
                    [
                        3,
                        "Kezutan"
                    ],
                    [
                        4,
                        "BenDover99"
                    ],
                    [
                        5,
                        "Maruc"
                    ],
                    [
                        6,
                        "goldieshdash"
                    ],
                    [
                        7,
                        "JeromieRomie02"
                    ],
                    [
                        8,
                        "suppercious"
                    ]
                ]
            },
            "IXSuzYHsFYUwn5m1A4B7mTqgc": {
                "id": "IXSuzYHsFYUwn5m1A4B7mTqgc",
                "dealerButtonLastRound": 7,
                "seats": [
                    [
                        1,
                        "Shadowfart8136"
                    ],
                    [
                        2,
                        "Kuora"
                    ],
                    [
                        3,
                        "Shreks#8141"
                    ],
                    [
                        4,
                        "prodbyzander"
                    ],
                    [
                        5,
                        "WenRare"
                    ],
                    [
                        6,
                        "heretovin"
                    ],
                    [
                        7,
                        "upsAder"
                    ]
                ]
            },
            "aAVopWN6RFYnixf1oI6ojZa9X": {
                "id": "aAVopWN6RFYnixf1oI6ojZa9X",
                "dealerButtonLastRound": 4,
                "seats": [
                    [
                        1,
                        "TillOneMill"
                    ],
                    [
                        2,
                        "Cryptofunk"
                    ],
                    [
                        3,
                        "turlututu"
                    ],
                    [
                        4,
                        "Killerqueen"
                    ],
                    [
                        5,
                        "Beowolf"
                    ],
                    [
                        6,
                        "Kierk"
                    ],
                    [
                        7,
                        "freecss"
                    ],
                    [
                        8,
                        "El Vega"
                    ]
                ]
            },
            "JE_DOCQhw-lj-uD33NM7aOHvu": {
                "id": "JE_DOCQhw-lj-uD33NM7aOHvu",
                "dealerButtonLastRound": 1,
                "seats": [
                    [
                        1,
                        "MrennerBorel"
                    ],
                    [
                        2,
                        "Viosil"
                    ],
                    [
                        3,
                        "JeremyV"
                    ],
                    [
                        4,
                        "iamburaky"
                    ],
                    [
                        5,
                        "YY10_SOL"
                    ],
                    [
                        6,
                        "NFTtradez"
                    ],
                    [
                        7,
                        "Nicofrosty7"
                    ],
                    [
                        8,
                        "Raamiana"
                    ]
                ]
            },
            "RT36wwNrF4xX_TZHPVGO1M8a_": {
                "id": "RT36wwNrF4xX_TZHPVGO1M8a_",
                "dealerButtonLastRound": 3,
                "seats": [
                    [
                        1,
                        "RedruM"
                    ],
                    [
                        2,
                        "topzzz"
                    ],
                    [
                        3,
                        "ThePureSoulDog"
                    ],
                    [
                        4,
                        "Staus"
                    ],
                    [
                        6,
                        "Ficky Shen"
                    ]
                ]
            },
            "IDQO4Fob_vuOjLNJKOlm6678s": {
                "id": "IDQO4Fob_vuOjLNJKOlm6678s",
                "dealerButtonLastRound": 2,
                "seats": [
                    [
                        1,
                        "Puddin2010"
                    ],
                    [
                        2,
                        "Tripwood"
                    ],
                    [
                        3,
                        "Eightba11"
                    ],
                    [
                        5,
                        "David 1254"
                    ],
                    [
                        6,
                        "Tsoupoutsou"
                    ],
                    [
                        7,
                        "bigscott"
                    ]
                ]
            },
            "P-madOjG3WSxPu33ufyLDnsh1": {
                "id": "P-madOjG3WSxPu33ufyLDnsh1",
                "dealerButtonLastRound": 8,
                "seats": [
                    [
                        1,
                        "Popel"
                    ],
                    [
                        2,
                        "shooterboy"
                    ],
                    [
                        3,
                        "Indio_Jau"
                    ],
                    [
                        4,
                        "EmmaKgLy"
                    ],
                    [
                        5,
                        "Phaasz"
                    ],
                    [
                        6,
                        "Wy2K | Soul do"
                    ],
                    [
                        7,
                        "Skoo"
                    ],
                    [
                        8,
                        "VasilisK"
                    ]
                ]
            },
            "WqptZCgPpS89M3dAAFFtbhDIK": {
                "id": "WqptZCgPpS89M3dAAFFtbhDIK",
                "dealerButtonLastRound": 6,
                "seats": [
                    [
                        2,
                        "Billy Woods"
                    ],
                    [
                        3,
                        "Aimee#7260"
                    ],
                    [
                        5,
                        "FabioN"
                    ],
                    [
                        6,
                        "BennyX"
                    ],
                    [
                        8,
                        "Kaz#3017"
                    ]
                ]
            },
            "WvXG7jt85Uq-O6zgByed6TvLt": {
                "id": "WvXG7jt85Uq-O6zgByed6TvLt",
                "dealerButtonLastRound": 2,
                "seats": [
                    [
                        2,
                        "Alibaba"
                    ],
                    [
                        4,
                        "Wahbart"
                    ],
                    [
                        5,
                        "Tj22"
                    ],
                    [
                        6,
                        "robinomega"
                    ],
                    [
                        8,
                        "BlazinMitchie"
                    ]
                ]
            },
            "ujTXYOvd3R2yWfjWKT1cE6v06": {
                "id": "ujTXYOvd3R2yWfjWKT1cE6v06",
                "dealerButtonLastRound": 6,
                "seats": [
                    [
                        1,
                        "MCS7192"
                    ],
                    [
                        2,
                        "Coletrain"
                    ],
                    [
                        3,
                        "cammypacz"
                    ],
                    [
                        4,
                        "Prince of Keny"
                    ],
                    [
                        5,
                        "Lukas 12"
                    ],
                    [
                        6,
                        "jakep1999#5516"
                    ],
                    [
                        7,
                        "ztudorx"
                    ],
                    [
                        8,
                        "MikzNFT"
                    ]
                ]
            },
            "aP3zLnqN40HIg3kHr7rxwwrXo": {
                "id": "aP3zLnqN40HIg3kHr7rxwwrXo",
                "dealerButtonLastRound": 2,
                "seats": [
                    [
                        1,
                        "Bazzzhe"
                    ],
                    [
                        3,
                        "InsideGod#8698"
                    ],
                    [
                        4,
                        "GASTON"
                    ],
                    [
                        5,
                        "BOO_Teng27"
                    ],
                    [
                        6,
                        "JungleTosh"
                    ],
                    [
                        7,
                        "Nixon Jr"
                    ],
                    [
                        8,
                        "aka_mene | RCC"
                    ]
                ]
            },
            "3Uj1emLbwqLKYlBaK1US_sFVY": {
                "id": "3Uj1emLbwqLKYlBaK1US_sFVY",
                "dealerButtonLastRound": 2,
                "seats": [
                    [
                        1,
                        "Mr-Tii"
                    ],
                    [
                        2,
                        "Simdog"
                    ],
                    [
                        3,
                        "Gabry#8322"
                    ],
                    [
                        5,
                        "Sto1c"
                    ],
                    [
                        6,
                        "matcha_queen"
                    ],
                    [
                        7,
                        "Dufflebagboi"
                    ],
                    [
                        8,
                        "esrever"
                    ]
                ]
            },
            "mhRh-13isfRSz3yXkvyJBNl05": {
                "id": "mhRh-13isfRSz3yXkvyJBNl05",
                "dealerButtonLastRound": 2,
                "seats": [
                    [
                        1,
                        "ToreMinas"
                    ],
                    [
                        2,
                        "yongyanglee"
                    ],
                    [
                        4,
                        "Veritas420"
                    ],
                    [
                        5,
                        "JEM"
                    ],
                    [
                        8,
                        "Peng#4103"
                    ]
                ]
            },
            "m2t8r8bZQWbTPBNZR0cJULRy0": {
                "id": "m2t8r8bZQWbTPBNZR0cJULRy0",
                "dealerButtonLastRound": 4,
                "seats": [
                    [
                        1,
                        "Swootey"
                    ],
                    [
                        3,
                        "King22"
                    ],
                    [
                        4,
                        "Rallan"
                    ],
                    [
                        5,
                        "dopor#0220"
                    ],
                    [
                        6,
                        "FancyPants"
                    ],
                    [
                        7,
                        "Єяяȏℛ()Ꮗꭿꮍ"
                    ],
                    [
                        8,
                        "Jonno007"
                    ]
                ]
            },
            "w0gtgTn5kWWbOaHquCtrb2Vwe": {
                "id": "w0gtgTn5kWWbOaHquCtrb2Vwe",
                "dealerButtonLastRound": 5,
                "seats": [
                    [
                        1,
                        "MetaGrimster"
                    ],
                    [
                        2,
                        "JSmash"
                    ],
                    [
                        3,
                        "Vaan21|SoulDog"
                    ],
                    [
                        4,
                        "Waldbeer"
                    ],
                    [
                        5,
                        "kosmoss13666"
                    ],
                    [
                        6,
                        "Joey#9908"
                    ],
                    [
                        7,
                        "NoBaeK"
                    ],
                    [
                        8,
                        "Fernando"
                    ]
                ]
            },
            "bnpjkywpdDgz0KkraPfcD030j": {
                "id": "bnpjkywpdDgz0KkraPfcD030j",
                "dealerButtonLastRound": 6,
                "seats": [
                    [
                        1,
                        "DapperDan"
                    ],
                    [
                        2,
                        "Sigrid"
                    ],
                    [
                        3,
                        "majcar"
                    ],
                    [
                        4,
                        "Parisiancrypto"
                    ],
                    [
                        5,
                        "kopif_tn"
                    ],
                    [
                        6,
                        "ChillxSoulDog"
                    ],
                    [
                        7,
                        "Luan Coelho"
                    ],
                    [
                        8,
                        "barcaboy"
                    ]
                ]
            },
            "40XV_yOH7kyee6ZNfiUXZIhRm": {
                "id": "40XV_yOH7kyee6ZNfiUXZIhRm",
                "dealerButtonLastRound": 5,
                "seats": [
                    [
                        2,
                        "Lando#8743"
                    ],
                    [
                        3,
                        "HodlSchool"
                    ],
                    [
                        4,
                        "triplecrown333"
                    ],
                    [
                        5,
                        "Smarty#2593"
                    ],
                    [
                        6,
                        "Strus"
                    ],
                    [
                        7,
                        "dirtyrice"
                    ],
                    [
                        8,
                        "Anatolii"
                    ]
                ]
            },
            "3TkoS3VhJUNYPvf_hVIl8UmEn": {
                "id": "3TkoS3VhJUNYPvf_hVIl8UmEn",
                "dealerButtonLastRound": 7,
                "seats": [
                    [
                        1,
                        "unforgivin"
                    ],
                    [
                        2,
                        "gsus#6995"
                    ],
                    [
                        3,
                        "burki"
                    ],
                    [
                        4,
                        "KilleQueen"
                    ],
                    [
                        5,
                        "Stef Bilzerian"
                    ],
                    [
                        6,
                        "lellos"
                    ],
                    [
                        7,
                        "Ochelios"
                    ],
                    [
                        8,
                        "sweatyintern"
                    ]
                ]
            },
            "TryVxPI2x_TlqdYrI5Ez0HM8e": {
                "id": "TryVxPI2x_TlqdYrI5Ez0HM8e",
                "dealerButtonLastRound": 4,
                "seats": [
                    [
                        1,
                        "Beavis1234"
                    ],
                    [
                        4,
                        "Gigabeat#6160"
                    ],
                    [
                        5,
                        "Berlin"
                    ],
                    [
                        6,
                        "Pokerface888"
                    ],
                    [
                        7,
                        "Nand"
                    ],
                    [
                        8,
                        "Aflak"
                    ]
                ]
            }
        }
    };
    var config = {
        maxPlayersPerTable: 8,
        breakWithLessThan: 8,
        balanceMinFlexibility: 0,
        balanceMaxFlexibility: 0 // 0 = Rebalance as much as possible
    };
    var result = __1.getMovements(state, config, "TryVxPI2x_TlqdYrI5Ez0HM8e");
    expect(result.movements.length).toBe(15);
    expect(result.stats.tableIdsBeingBrokenUp.length).toBe(3);
    expect(result.msTaken).toBeLessThan(10 * 1000);
});
//# sourceMappingURL=performance2.js.map