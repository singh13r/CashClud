        // ===== WAVE CANVAS =====
        function initWave(canvasId, sectionId) {
            var cv = document.getElementById(canvasId);
            var sec = document.getElementById(sectionId);
            if (!cv || !sec) return;
            var ctx = cv.getContext("2d");
            var W, H, dots, t = 0,
                mx = -999,
                my = -999;
            var SP = 22,
                R = 100;

            function resize() {
                W = cv.width = sec.offsetWidth;
                H = cv.height = sec.offsetHeight;
                dots = [];
                var cols = Math.ceil(W / SP) + 1;
                var rows = Math.ceil(H / SP) + 1;
                for (var r = 0; r < rows; r++) {
                    for (var c = 0; c < cols; c++) {
                        dots.push({
                            gx: c * SP,
                            gy: r * SP,
                            c: c,
                            r: r
                        });
                    }
                }
            }

            function draw() {
                ctx.clearRect(0, 0, W, H);
                ctx.fillStyle = "#011801";
                ctx.fillRect(0, 0, W, H);
                t += 0.018;
                for (var i = 0; i < dots.length; i++) {
                    var d = dots[i];
                    var wy = Math.sin(d.c * 0.3 + t) * 10 + Math.sin(d.r * 0.4 + t * 0.7) * 8;
                    var wx = Math.cos(d.r * 0.25 + t * 0.5) * 6;
                    var ps = 0.5 + (d.gy / H) * 0.7;
                    var px = d.gx + wx;
                    var py = d.gy + wy;
                    var dx = px - mx;
                    var dy = py - my;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var inten = 0,
                        popY = 0;
                    if (dist < R) {
                        inten = 1 - dist / R;
                        popY = -inten * 16;
                    }
                    var sz = 2.2 * ps + inten * 4;
                    var base = 35 + Math.round(ps * 30);
                    var g = base + Math.round(inten * 220);
                    var alpha = 0.35 + ps * 0.4 + inten * 0.4;
                    ctx.beginPath();
                    ctx.arc(px, py + popY, sz, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(0," + g + "," + Math.round(g * 0.25) + "," + alpha + ")";
                    ctx.fill();
                    if (inten > 0.3) {
                        ctx.beginPath();
                        ctx.arc(px, py + popY, sz + 2, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(0,255,80," + (inten * 0.25).toFixed(2) + ")";
                        ctx.fill();
                    }
                }
                requestAnimationFrame(draw);
            }

            sec.addEventListener("mousemove", function(e) {
                var r = cv.getBoundingClientRect();
                mx = e.clientX - r.left;
                my = e.clientY - r.top;
            });
            sec.addEventListener("mouseleave", function() {
                mx = -999;
                my = -999;
            });
            window.addEventListener("resize", resize);
            resize();
            draw();
        }

        window.addEventListener("load", function() {
            initWave("heroCanvas", "heroSection");
            initWave("dealsCanvas", "productsSection");
        });

        // ===== PAGES =====
        function showPage(p) {
            if (p === "admin" && !(currentUser && currentUser.isAdmin)) {
                showToast("Admin access only.");
                p = currentUser ? "dashboard" : "login";
            }
            document.querySelectorAll(".page").forEach(function(el) {
                el.classList.remove("active");
            });
            document.getElementById("page-" + p).classList.add("active");
            window.scrollTo(0, 0);
            updateNav();
        }

        function requireLogin(p) {
            if (!currentUser) {
                showPage("login");
                showToast("Please login first!");
                return;
            }
            showPage(p);
        }

        function getAdminAccess(email) {
            if (!email) return null;
            return ADMIN_ACCESS[(email || "").toLowerCase()] || null;
        }

        function buildCurrentUser(userId, name, email, balance) {
            var adminAccess = getAdminAccess(email);
            return {
                id: userId,
                name: name,
                email: email,
                isAdmin: !!adminAccess,
                balance: balance,
                adminAccess: adminAccess
            };
        }

        function hasAdminPermission(permission) {
            return !!(currentUser && currentUser.isAdmin && currentUser.adminAccess && currentUser.adminAccess[permission]);
        }

        function getDefaultAdminSection() {
            if (hasAdminPermission("viewOverview")) return "overview";
            if (hasAdminPermission("viewClaims")) return "claims";
            if (hasAdminPermission("viewWithdrawals")) return "withdrawals";
            if (hasAdminPermission("viewUsers")) return "users";
            return "overview";
        }

        function syncAdminAccessUi() {
            var permissionBySection = {
                overview: "viewOverview",
                claims: "viewClaims",
                withdrawals: "viewWithdrawals",
                users: "viewUsers"
            };
            Object.keys(permissionBySection).forEach(function(section) {
                var allowed = hasAdminPermission(permissionBySection[section]);
                var btn = document.querySelector('.admin-sidebar [data-admin-section="' + section + '"]');
                var panel = document.getElementById("admin-" + section);
                if (btn) {
                    btn.style.display = allowed ? "" : "none";
                    btn.classList.toggle("active", false);
                }
                if (panel) {
                    panel.style.display = allowed ? "" : "none";
                    panel.classList.toggle("active", false);
                }
            });

            var defaultSection = getDefaultAdminSection();
            var defaultButton = document.querySelector('.admin-sidebar [data-admin-section="' + defaultSection + '"]');
            if (defaultButton) {
                switchAdmin(defaultSection, defaultButton);
            }
        }

        function updateNav() {
            var nr = document.getElementById("navRight");
            if (currentUser) {
                if (currentUser.isAdmin) {
                    nr.innerHTML = '<div class="user-chip" data-page="admin"><span class="user-dot"></span>' + (currentUser.adminAccess.label || "Admin") + '</div><button class="nav-btn outline" data-action="logout">Logout</button>';
                } else {
                    nr.innerHTML =
                        '<button class="nav-link" data-page="shop">Shop</button>' +
                        '<div class="user-chip" data-page="dashboard"><span class="user-dot"></span>' + currentUser.name.split(" ")[0] + "</div>" +
                        '<button class="nav-link" data-page="terms">T&C</button>' +
                        '<button class="nav-btn outline" data-action="logout">Logout</button>';
                }
            } else {
                nr.innerHTML =
                    '<button class="nav-link" data-page="shop">Shop</button>' +
                    '<button class="nav-link" data-require-page="dashboard">Dashboard</button>' +
                    '<button class="nav-link" data-page="terms">T&C</button>' +
                    '<button class="nav-btn outline" data-page="login">Login</button>' +
                    '<button class="nav-btn" data-page="signup">Sign Up</button>';
            }
        }

        // ===== AUTH =====
        async function handleSignup() {
            var fn = document.getElementById("su-fname").value.trim();
            var ln = document.getElementById("su-lname").value.trim();
            var em = document.getElementById("su-email").value.trim();
            var ph = document.getElementById("su-phone").value.trim();
            var pw = document.getElementById("su-pass").value.trim();
            if (!fn || !em || !pw) {
                showToast("Please fill required fields!");
                return;
            }
            if (pw.length < 6) {
                showToast("Password must be at least 6 characters!");
                return;
            }
            showToast("Creating account...");
            var result = await supabase.auth.signUp({
                email: em,
                password: pw
            });
            if (result.error) {
                showToast("Error: " + result.error.message);
                return;
            }
            var userId = result.data.user.id;
            await supabase.from("users").insert({
                id: userId,
                name: fn + " " + ln,
                email: em,
                phone: ph,
                balance: 0
            });
            currentUser = buildCurrentUser(userId, fn + " " + ln, em, 0);
            document.getElementById("profileName").textContent = currentUser.name;
            document.getElementById("profileEmail").textContent = currentUser.email;
            document.getElementById("profileAvatar").textContent = fn[0].toUpperCase();
            if (currentUser.isAdmin) {
                await loadAdminData();
                renderAdminData();
                syncAdminAccessUi();
                showPage("admin");
            } else {
                showPage("dashboard");
            }
            showToast("Welcome " + fn + "! Account created successfully!");
        }

        async function handleLogin() {
            var em = document.getElementById("li-email").value.trim();
            var pw = document.getElementById("li-pass").value.trim();
            if (!em || !pw) {
                showToast("Enter email and password!");
                return;
            }
            var result = await supabase.auth.signInWithPassword({
                email: em,
                password: pw
            });
            if (result.error) {
                showToast("Error: " + result.error.message);
                return;
            }
            var userId = result.data.user.id;
            var userData = await supabase.from("users").select("*").eq("id", userId).single();
            if (userData.data) {
                currentUser = buildCurrentUser(userId, userData.data.name, em, userData.data.balance);
                document.getElementById("profileName").textContent = currentUser.name;
                document.getElementById("profileEmail").textContent = currentUser.email;
                document.getElementById("profileAvatar").textContent = currentUser.name[0].toUpperCase();
                document.getElementById("userBalance").textContent = currentUser.balance;
                if (currentUser.isAdmin) {
                    await loadAdminData();
                    renderAdminData();
                    syncAdminAccessUi();
                } else {
                    await loadUserTx();
                }
            }
            showPage(currentUser && currentUser.isAdmin ? "admin" : "dashboard");
            showToast("Welcome back " + currentUser.name.split(" ")[0] + "!");
        }


        async function handleLogout() {
            await supabase.auth.signOut();
            currentUser = null;
            txData = [];
            renderTxTable("txTableBody");
            renderTxTable("historyBody");
            updateNav();
            showPage("shop");
            showToast("Logged out.");
        }

        // ===== PRODUCTS =====
        function getPrice(price) {
            return parseInt(price.replace(/[^0-9]/g, "")) || 0;
        }

        function getCompareData(p) {
            var market = PRODUCT_MARKET_DATA[p.id] || {};
            return {
                amazonPrice: market.amazonPrice || p.price,
                amazonLink: p.link,
                flipkartPrice: market.flipkartPrice || p.price,
                flipkartLink: market.flipkartLink || ("https://www.flipkart.com/search?q=" + encodeURIComponent(p.name))
            };
        }

        function buildProductVisual(p, size) {
            if (p.img) {
                return '<img src="' + p.img + '" alt="' + p.name.replace(/"/g, "&quot;") + '" style="width:100%;height:100%;object-fit:cover;" />';
            }
            return '<span style="font-size:' + (size || "3.5rem") + '">' + p.emoji + "</span>";
        }

        function openCompareModal(id, event) {
            if (event) event.stopPropagation();
            var p = PRODUCTS.find(function(x) {
                return x.id === id;
            });
            if (!p) return;

            var compare = getCompareData(p);
            var amazonValue = getPrice(compare.amazonPrice);
            var flipkartValue = getPrice(compare.flipkartPrice);
            var total = amazonValue + flipkartValue;
            var amazonAngle = total ? Math.max(12, Math.round((amazonValue / total) * 360)) : 180;
            var gap = Math.abs(amazonValue - flipkartValue);
            var cheaperMarket = amazonValue <= flipkartValue ? "Amazon" : "Flipkart";
            var expensiveMarket = amazonValue > flipkartValue ? "Amazon" : "Flipkart";
            var gapBase = Math.max(1, Math.min(amazonValue, flipkartValue));
            var gapPercent = Math.round((gap / gapBase) * 100);
            var savingsText = gap === 0 ? "Both stores are currently at the same price." : cheaperMarket + " is cheaper by Rs." + gap.toLocaleString("en-IN") + " (" + gapPercent + "%) compared with " + expensiveMarket + ".";

            closeProdModal();

            document.getElementById("compareModalImg").innerHTML = buildProductVisual(p, "5rem");
            document.getElementById("compareModalName").textContent = p.name;
            document.getElementById("compareModalSub").textContent = "See the live gap, choose the better deal, and jump straight to the store you want.";
            document.getElementById("compareGapValue").textContent = gap === 0 ? "0" : "Rs." + gap.toLocaleString("en-IN");
            document.getElementById("compareGapLabel").textContent = gap === 0 ? "Same Price" : "Price Gap";
            document.getElementById("compareSummaryBanner").textContent = savingsText;
            document.getElementById("compareAmazonPrice").textContent = compare.amazonPrice;
            document.getElementById("compareFlipkartPrice").textContent = compare.flipkartPrice;
            document.getElementById("compareAmazonNote").textContent = amazonValue <= flipkartValue ? "Best price right now" : "Costs more right now";
            document.getElementById("compareFlipkartNote").textContent = flipkartValue <= amazonValue ? "Best price right now" : "Costs more right now";

            var chart = document.getElementById("compareChart");
            chart.style.setProperty("--amazon-angle", amazonAngle + "deg");

            document.getElementById("compareAmazonBtn").onclick = function(e) {
                goToMarket(p.id, "amazon", e);
            };
            document.getElementById("compareFlipkartBtn").onclick = function(e) {
                goToMarket(p.id, "flipkart", e);
            };

            document.getElementById("compareModal").style.display = "flex";
        }

        function closeCompareModal() {
            document.getElementById("compareModal").style.display = "none";
        }

        function goToMarket(id, marketName, event) {
            if (event) event.stopPropagation();
            var p = PRODUCTS.find(function(x) {
                return x.id === id;
            });
            if (!p) return;
            var compare = getCompareData(p);
            var isFlipkart = marketName === "flipkart";
            var siteLabel = isFlipkart ? "Flipkart" : "Amazon";
            var siteLink = isFlipkart ? compare.flipkartLink : compare.amazonLink;
            closeCompareModal();
            showToast("Opening " + siteLabel + "...");
            setTimeout(function() {
                window.open(siteLink, "_blank");
            }, 250);
        }

        function renderProducts(filter) {
            var list = filter === "all" ? PRODUCTS : PRODUCTS.filter(function(p) {
                return p.cat === filter;
            });
            var h = "";
            for (var i = 0; i < list.length; i++) {
                var p = list[i];
                var img = buildProductVisual(p, "3.5rem");
                var tag = getPrice(p.price) >= 1000 ?
                    '<div class="cashback-tag">' + p.cashback + " back</div>" :
                    '<div class="no-cashback-tag">Min Rs.1000</div>';
                h +=
                    '<div class="product-card" data-product-id="' + p.id + '">' +
                    '<div class="product-img" onclick="openProdModal(' + p.id + ')">' +
                    img +
                    '<button type="button" class="compare-trigger" onclick="openCompareModal(' + p.id + ', event)">Compare</button>' +
                    "</div>" +
                    '<div class="product-info">' +
                    '<div class="product-category">' + p.cat + "</div>" +
                    '<div class="product-name" onclick="openProdModal(' + p.id + ')">' + p.name + "</div>" +
                    '<div class="product-price-row">' +
                    '<div class="product-price">' + p.price + "</div>" +
                    tag +
                    "</div>" +
                    '<button class="amazon-btn" onclick="goToAmazon(' + p.id + ')">Buy on Amazon/Flipkart</button>' +
                    "</div></div>";
            }
            document.getElementById("productsGrid").innerHTML = h;
        }

        function filterProducts(cat, btn) {
            document.querySelectorAll(".tab").forEach(function(t) {
                t.classList.remove("active");
            });
            if (btn) btn.classList.add("active");
            renderProducts(cat);
        }

        function goToAmazon(id) {
            var p = PRODUCTS.find(function(x) {
                return x.id === id;
            });
            if (!p) return;
            closeCompareModal();
            if (!currentUser) showToast("Create a free account to track cashback!");
            else showToast("Redirecting to Amazon/Flipkart...");
            setTimeout(function() {
                window.open(p.link, "_blank");
            }, 700);
        }

        // ===== PRODUCT MODAL =====
        function openProdModal(id) {
            var p = PRODUCTS.find(function(x) {
                return x.id === id;
            });
            if (!p) return;
            closeCompareModal();
            var imgEl = document.getElementById("prodModalImg");
            imgEl.innerHTML = buildProductVisual(p, "5rem");
            document.getElementById("prodModalCat").textContent = p.cat;
            document.getElementById("prodModalName").textContent = p.name;
            document.getElementById("prodModalPrice").textContent = p.price;
            document.getElementById("prodModalCashback").textContent = getPrice(p.price) >= 1000 ? "cashback " + p.cashback : "Not eligible (Min Rs.1000)";
            document.getElementById("prodModalBtn").onclick = function() {
                goToAmazon(p.id);
            };
            document.getElementById("prodModal").style.display = "flex";
        }

        function closeProdModal() {
            document.getElementById("prodModal").style.display = "none";
        }

        // ===== DASHBOARD =====
        function renderTxTable(bodyId) {
            var h = "";
            for (var i = 0; i < txData.length; i++) {
                var t = txData[i];
                h +=
                    '<div class="tx-row">' +
                    '<div class="tx-product"><div class="tx-emoji">' + t.emoji + '</div><div style="font-size:.88rem;font-weight:500">' + t.name + "</div></div>" +
                    '<div class="tx-date-cell">' + t.date + "</div>" +
                    '<div class="amount-cell ' + t.cls + '">' + t.amount + "</div>" +
                    '<div><span class="status-pill ' + t.status + '">' + t.status + "</span></div>" +
                    "</div>";
            }
            document.getElementById(bodyId).innerHTML = h;
        }

        function switchDash(sec, btn) {
            document.querySelectorAll(".dash-section").forEach(function(s) {
                s.classList.remove("active");
            });
            document.getElementById("dash-" + sec).classList.add("active");
            if (btn) {
                document.querySelectorAll(".dash-sidebar .sidebar-item").forEach(function(b) {
                    b.classList.remove("active");
                });
                btn.classList.add("active");
            }
        }

        // ===== SCREENSHOT PREVIEW =====
        function previewSS(input) {
            var file = input.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showToast("Screenshot too large! Max 5MB.");
                input.value = "";
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("ssImg").src = e.target.result;
                document.getElementById("ssPreview").style.display = "block";
                document.getElementById("ssDropZone").style.borderColor = "var(--accent)";
                document.getElementById("ssDropZone").classList.remove("upload-error");
            };
            reader.readAsDataURL(file);
        }

        function clearSS() {
            document.getElementById("ssUpload").value = "";
            document.getElementById("ssPreview").style.display = "none";
            document.getElementById("ssDropZone").style.borderColor = "var(--border)";
            document.getElementById("ssDropZone").classList.remove("upload-error");
        }

        function focusClaimError(el) {
            if (!el) return;
            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            if (typeof el.focus === "function") {
                setTimeout(function() {
                    el.focus({
                        preventScroll: true
                    });
                }, 180);
            }
        }

        function sanitizeClaimProduct(input) {
            input.value = input.value.replace(/[^a-zA-Z\s]/g, "").replace(/\s{2,}/g, " ");
            var value = input.value.trim();
            input.classList.toggle("invalid", value.length === 0 || !/^[a-zA-Z\s]+$/.test(value));
        }

        function sanitizeOrderId(input) {
            var digits = input.value.replace(/\D/g, "").slice(0, 17);
            var parts = [];
            if (digits.length > 0) parts.push(digits.slice(0, 3));
            if (digits.length > 3) parts.push(digits.slice(3, 10));
            if (digits.length > 10) parts.push(digits.slice(10, 17));
            input.value = parts.join("-");
            input.classList.toggle("invalid", input.value.length === 0 || !/^\d{3}-\d{7}-\d{7}$/.test(input.value));
        }

        function sanitizeClaimAmount(input) {
            input.value = input.value.replace(/[^\d]/g, "");
            var value = input.value.trim();
            input.classList.toggle("invalid", value.length === 0 || !/^\d+$/.test(value) || parseInt(value, 10) < 1000);
        }

        async function submitClaim() {
            var productInput = document.getElementById("claimProduct");
            var orderInput = document.getElementById("orderInput");
            var amountInput = document.getElementById("claimAmount");
            var ssInput = document.getElementById("ssUpload");
            var ssDropZone = document.getElementById("ssDropZone");
            var orderId = orderInput.value.trim();
            var product = productInput.value.trim();
            var amount = amountInput.value.trim();
            var ssFile = ssInput.files[0];
            var orderIdPattern = /^\d{3}-\d{7}-\d{7}$/;

            if (!currentUser) {
                showToast("Please login first!");
                return;
            }
            if (!product) {
                productInput.classList.add("invalid");
                focusClaimError(productInput);
                showToast("Enter the product name!");
                return;
            }
            if (!/^[a-zA-Z\s]+$/.test(product)) {
                productInput.classList.add("invalid");
                focusClaimError(productInput);
                showToast("Product name can contain letters only!");
                return;
            }
            productInput.classList.remove("invalid");
            if (!orderId) {
                orderInput.classList.add("invalid");
                focusClaimError(orderInput);
                showToast("Enter your Amazon/Flipkart Order ID!");
                return;
            }
            if (!orderIdPattern.test(orderId)) {
                orderInput.classList.add("invalid");
                focusClaimError(orderInput);
                showToast("Order ID must be in 402-1234567-1234567 format!");
                return;
            }
            orderInput.classList.remove("invalid");
            if (!amount || !/^\d+$/.test(amount) || parseInt(amount, 10) < 1000) {
                amountInput.classList.add("invalid");
                focusClaimError(amountInput);
                showToast("Order amount must be Rs.1000 or above!");
                return;
            }
            amountInput.classList.remove("invalid");
            if (!ssFile) {
                ssDropZone.classList.add("upload-error");
                focusClaimError(ssDropZone);
                showToast("Please upload your delivered screenshot!");
                return;
            }
            ssDropZone.classList.remove("upload-error");

            showToast("Submitting claim...");

            // Upload screenshot to Supabase storage
            var ssFileRef = "";
            try {
                var fileName = currentUser.id + "_" + Date.now() + "_" + ssFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
                var upload = await supabase.storage.from("claim-screenshots").upload(fileName, ssFile);
                if (upload.data) {
                    // Store file path and generate signed links only for admin viewers.
                    ssFileRef = fileName;
                }
            } catch (e) { /* storage may not be set up, continue without */ }

            var result = await supabase.from("claims").insert({
                user_id: currentUser.id,
                order_id: orderId,
                product_name: product,
                amount: parseInt(amount),
                status: "pending",
                screenshot_url: ssFileRef
            });

            if (result.error) {
                showToast("Error submitting claim: " + result.error.message);
                return;
            }

            // Clear form
            document.getElementById("orderInput").value = "";
            document.getElementById("claimProduct").value = "";
            document.getElementById("claimAmount").value = "";
            clearSS();

            txData.unshift({
                emoji: "⏳",
                name: "Claim: " + orderId.slice(0, 18),
                date: "Today",
                amount: "+Rs.???",
                cls: "gold",
                status: "pending"
            });
            renderTxTable("txTableBody");
            renderTxTable("historyBody");
            showToast("✅ Claim submitted! Cashback will be credited in 15–30 days after verification.");
        }

        // ===== UPI MODAL =====
        function openUpi() {
            document.getElementById("upiModal").classList.add("open");
        }

        function closeUpi() {
            document.getElementById("upiModal").classList.remove("open");
        }

        function closeUpiOutside(e) {
            if (e.target === document.getElementById("upiModal")) closeUpi();
        }

        function selectUpi(el, method) {
            document.querySelectorAll(".upi-opt").forEach(function(o) {
                o.classList.remove("selected");
            });
            el.classList.add("selected");
            selectedUpiMethod = method;
        }

        function syncManual(v) {
            document.getElementById("amtManual").value = v;
        }

        function syncSlider(val) {
            var v = parseInt(val);
            if (isNaN(v)) return;
            v = Math.min(800, Math.max(300, v));
            document.getElementById("amtSlider").value = v;
        }

        async function submitWithdraw() {
            var upiId = document.getElementById("upiId").value.trim();
            var amt = parseInt(document.getElementById("amtManual").value);
            if (!upiId) {
                showToast("Enter your UPI ID!");
                return;
            }
            if (isNaN(amt) || amt < 300 || amt > 800) {
                showToast("Amount must be Rs.300 to Rs.800!");
                return;
            }
            if (!currentUser) {
                showToast("Please login first!");
                return;
            }
            var bal = parseInt(document.getElementById("userBalance").textContent.replace(",", ""));
            if (amt > bal) {
                showToast("Insufficient balance!");
                return;
            }
            closeUpi();
            var result = await supabase.from("withdrawals").insert({
                user_id: currentUser.id,
                method: selectedUpiMethod,
                upi_id: upiId,
                amount: amt,
                status: "pending"
            });
            if (result.error) {
                showToast("Error submitting withdrawal!");
                return;
            }
            await supabase.from("users").update({
                balance: bal - amt
            }).eq("id", currentUser.id);
            document.getElementById("userBalance").textContent = bal - amt;
            txData.unshift({
                emoji: "💸",
                name: "UPI Withdrawal - " + upiId,
                date: "Today",
                amount: "-Rs." + amt,
                cls: "red",
                status: "pending"
            });
            renderTxTable("txTableBody");
            renderTxTable("historyBody");
            showToast("Withdrawal of Rs." + amt + " submitted!");
        }

        // ===== ADMIN =====
        function renderAdminData() {
            var pending = adminClaims.filter(function(c) {
                return c.status === "pending";
            });
            var canApproveClaims = hasAdminPermission("approveClaims");
            var canApproveWithdrawals = hasAdminPermission("approveWithdrawals");
            var h = "";
            for (var i = 0; i < pending.length; i++) {
                var c = pending[i];
                var ssLink = c.screenshot_url ? '<a href="' + c.screenshot_url + '" target="_blank" style="color:var(--accent);font-size:.75rem;font-weight:600;text-decoration:none">📸 View SS</a>' : '<span style="color:var(--muted);font-size:.75rem">No SS</span>';
                h +=
                    '<div class="admin-row" style="grid-template-columns:2fr 1.2fr 1fr 1fr 1.5fr">' +
                    "<div><div style=\"font-size:.88rem;font-weight:500\">" + c.user + "</div><div style=\"font-size:.75rem;color:var(--muted)\">" + c.product + "</div></div>" +
                    "<div style=\"font-size:.78rem;color:var(--muted)\">" + c.orderId.slice(0, 16) + "...</div>" +
                    "<div>" + ssLink + "</div>" +
                    "<div style=\"font-family:'Syne',sans-serif;font-weight:700;color:var(--gold)\">" + c.amount + "</div>" +
                    (canApproveClaims ? '<div class="admin-actions"><button class="approve-btn" onclick="approveClaimP(' + i + ')">Approve</button><button class="reject-btn" onclick="rejectClaimP(' + i + ')">Reject</button></div>' : '<div style="font-size:.78rem;color:var(--muted)">Review only</div>') +
                    "</div>";
            }
            document.getElementById("adminOverviewClaims").innerHTML = h || '<div style="padding:1.5rem;text-align:center;color:var(--muted)">No pending claims</div>';

            h = "";
            for (var i = 0; i < adminClaims.length; i++) {
                var c = adminClaims[i];
                var ssLink = c.screenshot_url ? '<a href="' + c.screenshot_url + '" target="_blank" style="color:var(--accent);font-size:.75rem;font-weight:600;text-decoration:none">📸 View SS</a>' : '<span style="color:var(--muted);font-size:.75rem">No SS</span>';
                h +=
                    '<div class="admin-row" style="grid-template-columns:2fr 1.2fr 1fr 1fr 1.5fr">' +
                    "<div><div style=\"font-size:.88rem;font-weight:500\">" + c.user + "</div><div style=\"font-size:.75rem;color:var(--muted)\">" + c.product + "</div></div>" +
                    "<div style=\"font-size:.78rem;color:var(--muted)\">" + c.orderId.slice(0, 16) + "...</div>" +
                    "<div>" + ssLink + "</div>" +
                    "<div style=\"font-family:'Syne',sans-serif;font-weight:700\">" + c.amount + "</div>" +
                    "<div>" + (c.status === "pending" && canApproveClaims ? '<div class="admin-actions"><button class="approve-btn" onclick="approveClaim(' + i + ')">Approve</button><button class="reject-btn" onclick="rejectClaim(' + i + ')">Reject</button></div>' : '<span class="status-pill ' + c.status + '">' + c.status + "</span>") + "</div>" +
                    "</div>";
            }
            document.getElementById("allClaimsBody").innerHTML = h;

            h = "";
            for (var i = 0; i < adminWithdrawals.length; i++) {
                var w = adminWithdrawals[i];
                h +=
                    '<div class="admin-row" style="grid-template-columns:2fr 1fr 1.5fr">' +
                    "<div><div style=\"font-size:.88rem;font-weight:500\">" + w.user + "</div><div style=\"font-size:.75rem;color:var(--muted)\">" + w.method + "</div></div>" +
                    "<div style=\"font-family:'Syne',sans-serif;font-weight:700;color:var(--accent)\">" + w.amount + "</div>" +
                    "<div>" + (w.status === "pending" && canApproveWithdrawals ? '<div class="admin-actions"><button class="approve-btn" onclick="approveWithdraw(' + i + ')">Pay</button><button class="reject-btn" onclick="rejectWithdraw(' + i + ')">Reject</button></div>' : '<span class="status-pill ' + w.status + '">' + w.status + "</span>") + "</div>" +
                    "</div>";
            }
            document.getElementById("withdrawBody").innerHTML = h;

            h = "";
            for (var i = 0; i < adminUsers.length; i++) {
                var u = adminUsers[i];
                h +=
                    '<div class="admin-row" style="grid-template-columns:2fr 1.5fr 1fr 1fr 1fr">' +
                    '<div class="user-info"><div class="user-avatar">' + u.name[0] + "</div><div style=\"font-size:.9rem;font-weight:500\">" + u.name + "</div></div>" +
                    "<div style=\"font-size:.82rem;color:var(--muted)\">" + u.email + "</div>" +
                    "<div style=\"font-family:'Syne',sans-serif;font-weight:700;color:var(--accent)\">" + u.balance + "</div>" +
                    "<div style=\"font-size:.88rem\">" + u.claims + "</div>" +
                    '<div><span class="status-pill approved">' + u.status + "</span></div>" +
                    "</div>";
            }
            document.getElementById("usersBody").innerHTML = h;
        }

        function switchAdmin(sec, btn) {
            var permissionBySection = {
                overview: "viewOverview",
                claims: "viewClaims",
                withdrawals: "viewWithdrawals",
                users: "viewUsers"
            };
            if (!hasAdminPermission(permissionBySection[sec])) {
                showToast("You do not have access to that admin section.");
                return;
            }
            document.querySelectorAll(".admin-section").forEach(function(s) {
                s.classList.remove("active");
            });
            document.getElementById("admin-" + sec).classList.add("active");
            if (btn) {
                document.querySelectorAll(".admin-sidebar .sidebar-item").forEach(function(b) {
                    b.classList.remove("active");
                });
                btn.classList.add("active");
            }
        }

        function approveClaim(i) {
            adminClaims[i].status = "approved";
            renderAdminData();
            showToast("Claim approved!");
        }

        function rejectClaim(i) {
            adminClaims[i].status = "rejected";
            renderAdminData();
            showToast("Claim rejected.");
        }

        function approveClaimP(i) {
            var p = adminClaims.filter(function(c) {
                return c.status === "pending";
            });
            adminClaims[adminClaims.indexOf(p[i])].status = "approved";
            renderAdminData();
            showToast("Claim approved!");
        }

        function rejectClaimP(i) {
            var p = adminClaims.filter(function(c) {
                return c.status === "pending";
            });
            adminClaims[adminClaims.indexOf(p[i])].status = "rejected";
            renderAdminData();
            showToast("Claim rejected.");
        }

        function approveWithdraw(i) {
            adminWithdrawals[i].status = "approved";
            renderAdminData();
            showToast("Payment sent!");
        }

        function rejectWithdraw(i) {
            adminWithdrawals[i].status = "rejected";
            renderAdminData();
            showToast("Withdrawal rejected.");
        }

        // ===== TOAST =====
        var toastTimer;

        function showToast(msg) {
            clearTimeout(toastTimer);
            document.getElementById("toastMsg").textContent = msg;
            var t = document.getElementById("toast");
            t.classList.add("show");
            toastTimer = setTimeout(function() {
                t.classList.remove("show");
            }, 3500);
        }

        // ===== LOAD USER TX =====
        async function loadUserTx() {
            if (!currentUser || !currentUser.id) return;
            var claims = await supabase.from("claims").select("*").eq("user_id", currentUser.id).order("created_at", {
                ascending: false
            });
            var withdrawals = await supabase.from("withdrawals").select("*").eq("user_id", currentUser.id).order("created_at", {
                ascending: false
            });
            txData = [];
            if (claims.data) {
                claims.data.forEach(function(c) {
                    txData.push({
                        emoji: "🧾",
                        name: "Claim: " + c.order_id.slice(0, 16),
                        date: new Date(c.created_at).toLocaleDateString("en-IN"),
                        amount: "+Rs.???",
                        cls: "gold",
                        status: c.status
                    });
                });
            }
            if (withdrawals.data) {
                withdrawals.data.forEach(function(w) {
                    txData.push({
                        emoji: "💸",
                        name: "UPI - " + w.upi_id,
                        date: new Date(w.created_at).toLocaleDateString("en-IN"),
                        amount: "-Rs." + w.amount,
                        cls: "red",
                        status: w.status
                    });
                });
            }
            renderTxTable("txTableBody");
            renderTxTable("historyBody");
        }

        // ===== LOAD ADMIN DATA =====
        async function loadAdminData() {
            async function resolveScreenshotLink(rawValue) {
                if (!rawValue) return "";
                if (/^https?:\/\//i.test(rawValue)) return rawValue;
                var signed = await supabase.storage.from("claim-screenshots").createSignedUrl(rawValue, 60 * 60);
                if (signed && signed.data && signed.data.signedUrl) return signed.data.signedUrl;
                return "";
            }

            var claims = hasAdminPermission("viewClaims") ? await supabase.from("claims").select("*, users(name, email)").order("created_at", {
                ascending: false
            }) : {
                data: []
            };
            var withdrawals = hasAdminPermission("viewWithdrawals") ? await supabase.from("withdrawals").select("*, users(name, email)").order("created_at", {
                ascending: false
            }) : {
                data: []
            };
            var users = hasAdminPermission("viewUsers") ? await supabase.from("users").select("*").order("created_at", {
                ascending: false
            }) : {
                data: []
            };
            if (claims.data) {
                var mappedClaims = await Promise.all(claims.data.map(async function(c) {
                    var screenshotLink = await resolveScreenshotLink(c.screenshot_url || "");
                    return {
                        user: c.users ? c.users.name : "User",
                        product: c.productname || c.product_name || "",
                        orderId: c.order_id,
                        amount: "Rs." + (c.amount || "???"),
                        status: c.status,
                        id: c.id,
                        screenshot_url: screenshotLink
                    };
                }));
                adminClaims = mappedClaims;
            }
            if (withdrawals.data) {
                adminWithdrawals = withdrawals.data.map(function(w) {
                    return {
                        user: w.users ? w.users.name : "User",
                        method: w.method + " - " + w.upi_id,
                        amount: "Rs." + w.amount,
                        status: w.status,
                        id: w.id,
                        userId: w.user_id
                    };
                });
            }
            if (users.data) {
                adminUsers = users.data.map(function(u) {
                    return {
                        name: u.name,
                        email: u.email,
                        balance: "Rs." + u.balance,
                        claims: 0,
                        status: "active"
                    };
                });
            }
        }

        // Override approve/reject to update Supabase
        async function approveClaim(i) {
            if (!hasAdminPermission("approveClaims")) {
                showToast("Only the owner admin can approve claims.");
                return;
            }
            if (adminClaims[i].id) await supabase.from("claims").update({
                status: "approved"
            }).eq("id", adminClaims[i].id);
            adminClaims[i].status = "approved";
            renderAdminData();
            showToast("Claim approved!");
        }
        async function rejectClaim(i) {
            if (!hasAdminPermission("approveClaims")) {
                showToast("Only the owner admin can reject claims.");
                return;
            }
            if (adminClaims[i].id) await supabase.from("claims").update({
                status: "rejected"
            }).eq("id", adminClaims[i].id);
            adminClaims[i].status = "rejected";
            renderAdminData();
            showToast("Claim rejected.");
        }
        async function approveWithdraw(i) {
            if (!hasAdminPermission("approveWithdrawals")) {
                showToast("Only your owner admin account can approve withdrawals.");
                return;
            }
            var w = adminWithdrawals[i];
            if (w.id) await supabase.from("withdrawals").update({
                status: "approved"
            }).eq("id", w.id);
            adminWithdrawals[i].status = "approved";
            renderAdminData();
            showToast("Payment sent!");
        }
        async function rejectWithdraw(i) {
            if (!hasAdminPermission("approveWithdrawals")) {
                showToast("Only your owner admin account can reject withdrawals.");
                return;
            }
            if (adminWithdrawals[i].id) await supabase.from("withdrawals").update({
                status: "rejected"
            }).eq("id", adminWithdrawals[i].id);
            adminWithdrawals[i].status = "rejected";
            renderAdminData();
            showToast("Withdrawal rejected.");
        }

        function bindStaticUiEvents() {
            document.addEventListener("click", function(e) {
                var pageTrigger = e.target.closest("[data-page]");
                if (pageTrigger) {
                    showPage(pageTrigger.getAttribute("data-page"));
                    return;
                }

                var protectedPageTrigger = e.target.closest("[data-require-page]");
                if (protectedPageTrigger) {
                    requireLogin(protectedPageTrigger.getAttribute("data-require-page"));
                    return;
                }

                var filterTrigger = e.target.closest("[data-filter]");
                if (filterTrigger) {
                    filterProducts(filterTrigger.getAttribute("data-filter"), filterTrigger);
                    return;
                }

                var dashTrigger = e.target.closest("[data-dash-section]");
                if (dashTrigger) {
                    switchDash(dashTrigger.getAttribute("data-dash-section"), dashTrigger);
                    return;
                }

                var adminTrigger = e.target.closest("[data-admin-section]");
                if (adminTrigger) {
                    switchAdmin(adminTrigger.getAttribute("data-admin-section"), adminTrigger);
                    return;
                }

                var upiTrigger = e.target.closest("[data-upi-method]");
                if (upiTrigger) {
                    selectUpi(upiTrigger, upiTrigger.getAttribute("data-upi-method"));
                    return;
                }

                var actionTrigger = e.target.closest("[data-action]");
                if (actionTrigger) {
                    var action = actionTrigger.getAttribute("data-action");
                    if (action === "close-upi") closeUpi();
                    else if (action === "submit-withdraw") submitWithdraw();
                    else if (action === "close-product-modal") closeProdModal();
                    else if (action === "close-compare-modal") closeCompareModal();
                    else if (action === "scroll-products") document.getElementById("productsSection").scrollIntoView({
                        behavior: "smooth"
                    });
                    else if (action === "signup") handleSignup();
                    else if (action === "login") handleLogin();
                    else if (action === "open-upi") openUpi();
                    else if (action === "open-upload") document.getElementById("ssUpload").click();
                    else if (action === "clear-upload") clearSS();
                    else if (action === "submit-claim") submitClaim();
                    else if (action === "logout") handleLogout();
                    return;
                }

                var overlayTrigger = e.target.closest("[data-close-overlay]");
                if (overlayTrigger && e.target === overlayTrigger) {
                    var overlayType = overlayTrigger.getAttribute("data-close-overlay");
                    if (overlayType === "upi") closeUpi();
                    else if (overlayType === "product") closeProdModal();
                    else if (overlayType === "compare") closeCompareModal();
                    return;
                }

                if (e.target.closest("[data-stop-close]")) {
                    e.stopPropagation();
                }
            });

            document.addEventListener("input", function(e) {
                var syncTarget = e.target.getAttribute("data-sync");
                if (syncTarget === "manual") syncManual(e.target.value);
                else if (syncTarget === "slider") syncSlider(e.target.value);

                var sanitizeTarget = e.target.getAttribute("data-sanitize");
                if (sanitizeTarget === "claim-product") sanitizeClaimProduct(e.target);
                else if (sanitizeTarget === "order-id") sanitizeOrderId(e.target);
                else if (sanitizeTarget === "claim-amount") sanitizeClaimAmount(e.target);
            });

            document.addEventListener("change", function(e) {
                if (e.target.matches("[data-action='preview-upload']")) {
                    previewSS(e.target);
                }
            });
        }

        // Check if user already logged in
        window.addEventListener("load", async function() {
            var session = await supabase.auth.getSession();
            if (session.data.session) {
                var userId = session.data.session.user.id;
                var em = session.data.session.user.email;
                var userData = await supabase.from("users").select("*").eq("id", userId).single();
                if (userData.data) {
                    currentUser = buildCurrentUser(userId, userData.data.name, em, userData.data.balance);
                    document.getElementById("profileName").textContent = currentUser.name;
                    document.getElementById("profileEmail").textContent = currentUser.email;
                    document.getElementById("profileAvatar").textContent = currentUser.name[0].toUpperCase();
                    document.getElementById("userBalance").textContent = currentUser.balance;
                    if (currentUser.isAdmin) {
                        await loadAdminData();
                        renderAdminData();
                        syncAdminAccessUi();
                        showPage("admin");
                    } else {
                        await loadUserTx();
                    }
                    updateNav();
                }
            }
        });

        // ===== INIT =====
        bindStaticUiEvents();

        renderProducts("all");
        renderTxTable("txTableBody");
        renderTxTable("historyBody");
