        // ===== DATA =====
        var PRODUCTS = [{
            id: 1,
            name: "boAt Rockerz 650 Pro Headphones",
            price: "Rs.2,999",
            cashback: "2%",
            cat: "tech",
            emoji: "🎧",
            img: "../assets/images/products/boat-headphones.jpg",
            link: "https://www.amazon.in/s?k=boat+rockerz+650+pro&tag=YOURTAG-21"
        }, {
            id: 2,
            name: "Redmi Note 15 Pro+ 5G 256GB",
            price: "Rs.26,999",
            cashback: "5%",
            cat: "tech",
            emoji: "📱",
            img: "../assets/images/products/redmi-phone.png",
            link: "https://www.amazon.in/s?k=redmi+note+15+pro&tag=YOURTAG-21"
        }, {
            id: 3,
            name: "Noise Pulse 2 Pro Smartwatch",
            price: "Rs.2,499",
            cashback: "2%",
            cat: "tech",
            emoji: "⌚",
            img: "../assets/images/products/noise-watch.jpg",
            link: "https://www.amazon.in/s?k=noise+pulse+2+pro&tag=YOURTAG-21"
        }, {
            id: 4,
            name: "JBL Go Essential Portable Speaker",
            price: "Rs.1,999",
            cashback: "2%",
            cat: "tech",
            emoji: "🔊",
            img: "../assets/images/products/jbl-speaker.jpg",
            link: "https://www.amazon.in/s?k=jbl+go+essential&tag=YOURTAG-21"
        }, {
            id: 5,
            name: "HP 15 13th Gen Core i3 Laptop",
            price: "Rs.42,990",
            cashback: "6%",
            cat: "tech",
            emoji: "💻",
            img: "../assets/images/products/hp-laptop.jpg",
            link: "https://www.amazon.in/s?k=hp+15+13th+gen+i3&tag=YOURTAG-21"
        }, {
            id: 6,
            name: "GOBOULT x Mustang Torq Earbuds",
            price: "Rs.1,499",
            cashback: "2%",
            cat: "tech",
            emoji: "🎵",
            img: "../assets/images/products/mustang-earbuds.webp",
            link: "https://www.amazon.in/s?k=goboult+mustang+torq+earbuds&tag=YOURTAG-21"
        }, {
            id: 7,
            name: "Fastrack Astor FR2 Pro Smartwatch",
            price: "Rs.3,995",
            cashback: "3%",
            cat: "tech",
            emoji: "⌚",
            img: "../assets/images/products/fastrack-watch.jpg",
            link: "https://www.amazon.in/s?k=fastrack+astor+fr2+pro&tag=YOURTAG-21"
        }, {
            id: 8,
            name: "Levis Men Slim Fit Jeans",
            price: "Rs.1,799",
            cashback: "2%",
            cat: "fashion",
            emoji: "👖",
            img: "",
            link: "https://www.amazon.in/s?k=levis+jeans+men&tag=YOURTAG-21"
        }, {
            id: 9,
            name: "Puma Men Sneakers",
            price: "Rs.2,499",
            cashback: "2%",
            cat: "fashion",
            emoji: "👟",
            img: "",
            link: "https://www.amazon.in/s?k=puma+sneakers+men&tag=YOURTAG-21"
        }, {
            id: 10,
            name: "Amazon/Flipkart Echo Dot 5th Gen",
            price: "Rs.4,499",
            cashback: "4%",
            cat: "home",
            emoji: "🔮",
            img: "../assets/images/products/echo-dot.jpg",
            link: "https://www.amazon.in/s?k=echo+dot+5th+gen&tag=YOURTAG-21"
        }, {
            id: 11,
            name: "Pigeon Healthifry Digital Air Fryer",
            price: "Rs.2,799",
            cashback: "2%",
            cat: "Kitchen",
            emoji: "🥘",
            img: "../assets/images/products/pigeon-airfryer.jpg",
            link: "https://www.amazon.in/s?k=pigeon+healthifry+air+fryer&tag=YOURTAG-21"
        }, {
            id: 12,
            name: "Philips Air Fryer 4L",
            price: "Rs.5,999",
            cashback: "5%",
            cat: "Kitchen",
            emoji: "🍳",
            img: "",
            link: "https://www.amazon.in/s?k=philips+air+fryer&tag=YOURTAG-21"
        }, {
            id: 13,
            name: "Havells Room Heater 2000W",
            price: "Rs.1,999",
            cashback: "2%",
            cat: "home",
            emoji: "🌡️",
            img: "",
            link: "https://www.amazon.in/s?k=havells+room+heater&tag=YOURTAG-21"
        }, {
            id: 14,
            name: "Fitbit Inspire 3 Fitness Tracker",
            price: "Rs.7,999",
            cashback: "6%",
            cat: "fitness",
            emoji: "🏃",
            img: "",
            link: "https://www.amazon.in/s?k=fitbit+inspire+3&tag=YOURTAG-21"
        }, {
            id: 15,
            name: "Boldfit Smart Pro Gym Set",
            price: "Rs.1,299",
            cashback: "2%",
            cat: "fitness",
            emoji: "🥊",
            img: "",
            link: "https://www.amazon.in/s?k=boldfit+gym+set&tag=YOURTAG-21"
        }, ];

        var PRODUCT_MARKET_DATA = {
            1: {
                amazonPrice: "Rs.2,999",
                flipkartPrice: "Rs.3,149",
                flipkartLink: "https://www.flipkart.com/search?q=boAt+Rockerz+650+Pro+Headphones"
            },
            2: {
                amazonPrice: "Rs.26,999",
                flipkartPrice: "Rs.27,499",
                flipkartLink: "https://www.flipkart.com/search?q=Redmi+Note+15+Pro+5G+256GB"
            },
            3: {
                amazonPrice: "Rs.2,499",
                flipkartPrice: "Rs.2,699",
                flipkartLink: "https://www.flipkart.com/search?q=Noise+Pulse+2+Pro+Smartwatch"
            },
            4: {
                amazonPrice: "Rs.1,999",
                flipkartPrice: "Rs.2,149",
                flipkartLink: "https://www.flipkart.com/search?q=JBL+Go+Essential+Portable+Speaker"
            },
            5: {
                amazonPrice: "Rs.42,990",
                flipkartPrice: "Rs.43,490",
                flipkartLink: "https://www.flipkart.com/search?q=HP+15+13th+Gen+Core+i3+Laptop"
            },
            6: {
                amazonPrice: "Rs.1,499",
                flipkartPrice: "Rs.1,649",
                flipkartLink: "https://www.flipkart.com/search?q=GOBOULT+Mustang+Torq+Earbuds"
            },
            7: {
                amazonPrice: "Rs.3,995",
                flipkartPrice: "Rs.4,149",
                flipkartLink: "https://www.flipkart.com/search?q=Fastrack+Astor+FR2+Pro+Smartwatch"
            },
            8: {
                amazonPrice: "Rs.1,799",
                flipkartPrice: "Rs.1,899",
                flipkartLink: "https://www.flipkart.com/search?q=Levis+Men+Slim+Fit+Jeans"
            },
            9: {
                amazonPrice: "Rs.2,499",
                flipkartPrice: "Rs.2,349",
                flipkartLink: "https://www.flipkart.com/search?q=Puma+Men+Sneakers"
            },
            10: {
                amazonPrice: "Rs.4,499",
                flipkartPrice: "Rs.4,799",
                flipkartLink: "https://www.flipkart.com/search?q=Amazon/Flipkart+Echo+Dot+5th+Gen"
            },
            11: {
                amazonPrice: "Rs.2,799",
                flipkartPrice: "Rs.2,999",
                flipkartLink: "https://www.flipkart.com/search?q=Pigeon+Healthifry+Digital+Air+Fryer"
            },
            12: {
                amazonPrice: "Rs.5,999",
                flipkartPrice: "Rs.6,249",
                flipkartLink: "https://www.flipkart.com/search?q=Philips+Air+Fryer+4L"
            },
            13: {
                amazonPrice: "Rs.1,999",
                flipkartPrice: "Rs.2,149",
                flipkartLink: "https://www.flipkart.com/search?q=Havells+Room+Heater+2000W"
            },
            14: {
                amazonPrice: "Rs.7,999",
                flipkartPrice: "Rs.8,299",
                flipkartLink: "https://www.flipkart.com/search?q=Fitbit+Inspire+3+Fitness+Tracker"
            },
            15: {
                amazonPrice: "Rs.1,299",
                flipkartPrice: "Rs.1,449",
                flipkartLink: "https://www.flipkart.com/search?q=Boldfit+Smart+Pro+Gym+Set"
            }
        };

        var txData = [{
            emoji: "🎧",
            name: "boAt Rockerz 450",
            date: "Mar 10",
            amount: "+Rs.89",
            cls: "green",
            status: "approved"
        }, {
            emoji: "📱",
            name: "Redmi Note 13 Pro",
            date: "Mar 09",
            amount: "+Rs.959",
            cls: "gold",
            status: "pending"
        }, {
            emoji: "🍳",
            name: "Philips Air Fryer",
            date: "Mar 07",
            amount: "+Rs.360",
            cls: "green",
            status: "approved"
        }, {
            emoji: "👟",
            name: "Campus Running Shoes",
            date: "Mar 05",
            amount: "+Rs.63",
            cls: "green",
            status: "approved"
        }, {
            emoji: "💸",
            name: "UPI Withdrawal",
            date: "Mar 01",
            amount: "-Rs.500",
            cls: "red",
            status: "approved"
        }, ];

        var adminClaims = [{
            user: "Gurjot Singh",
            product: "Redmi Note 13 Pro",
            orderId: "402-8234567-1234567",
            amount: "Rs.959",
            status: "pending"
        }, {
            user: "Priya Sharma",
            product: "boAt Rockerz 450",
            orderId: "402-1234111-9876543",
            amount: "Rs.89",
            status: "pending"
        }, {
            user: "Arjun Mehta",
            product: "Philips Air Fryer",
            orderId: "405-3456789-2345678",
            amount: "Rs.360",
            status: "approved"
        }, {
            user: "Simran Kaur",
            product: "Fitbit Inspire 3",
            orderId: "402-9876543-1111111",
            amount: "Rs.399",
            status: "rejected"
        }, {
            user: "Rahul Kumar",
            product: "HP Laptop",
            orderId: "402-1111111-2222222",
            amount: "Rs.1,079",
            status: "pending"
        }, ];

        var adminWithdrawals = [{
            user: "Gurjot Singh",
            method: "Google Pay - gurjot@okaxis",
            amount: "Rs.500",
            status: "pending"
        }, {
            user: "Priya Sharma",
            method: "Paytm - 9876543210",
            amount: "Rs.200",
            status: "pending"
        }, {
            user: "Arjun Mehta",
            method: "PhonePe - arjun@ybl",
            amount: "Rs.350",
            status: "approved"
        }, ];

        var adminUsers = [{
            name: "Gurjot Singh",
            email: "gurjot@gmail.com",
            balance: "Rs.348",
            claims: 5,
            status: "active"
        }, {
            name: "Priya Sharma",
            email: "priya@gmail.com",
            balance: "Rs.89",
            claims: 2,
            status: "active"
        }, {
            name: "Arjun Mehta",
            email: "arjun@gmail.com",
            balance: "Rs.210",
            claims: 3,
            status: "active"
        }, {
            name: "Simran Kaur",
            email: "simran@gmail.com",
            balance: "Rs.0",
            claims: 1,
            status: "active"
        }, {
            name: "Rahul Kumar",
            email: "rahul@gmail.com",
            balance: "Rs.1,200",
            claims: 4,
            status: "active"
        }, ];

        var currentUser = null;
        var selectedUpiMethod = "gpay";

        var ADMIN_ACCESS = {
            "gur1322r@gmail.com": {
                label: "Owner Admin",
                viewOverview: true,
                viewClaims: true,
                viewWithdrawals: true,
                viewUsers: true,
                approveClaims: true,
                approveWithdrawals: true
            },
            "officalankitrajput@gmail.com": {
                label: "Review Admin",
                viewOverview: false,
                viewClaims: true,
                viewWithdrawals: true,
                viewUsers: false,
                approveClaims: false,
                approveWithdrawals: false
            }
        };



