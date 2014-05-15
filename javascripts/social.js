/**
 * Social Button
 *
 * Copyright (c) 2014 by Hsiaoming Yang.
 */




(function() {
    var t = {};
    var e = {
        twitter: "https://twitter.com/intent/tweet?text={text}&url={url}",
        facebook: "http://www.facebook.com/sharer.php?t={text}&u={url}",
        weibo: "http://service.weibo.com/share/share.php?title={text}&url={url}"
    };
    var o = 8003029170;

    function n(t, n) {
        n = n || {};
        var l = n.prefix || t.getAttribute("data-prefix") || "icon-";
        var s = n.text || t.getAttribute("data-text");
        var d = n.url || t.getAttribute("data-url") || location.href;
        var f = n.image || t.getAttribute("data-image");
        var p = n.count || t.getAttribute("data-count");
        o = n.weiboKey || t.getAttribute("data-weibo-key") || o;
        var m = {
            twitter: n.twitter || t.getAttribute("data-twitter"),
            facebook: n.facebook || t.getAttribute("data-facebook"),
            weibo: n.weibo || t.getAttribute("data-weibo")
        };
        var h = {
            twitter: c,
            facebook: i,
            weibo: u
        };

        function v(o) {
            if (!m[o]) return;
            var n = document.createElement("div");
            n.className = "social-button-item social-button-" + o;
            var i = document.createElement("a");
            i.className = "social-button-icon social-button-icon-" + o + " " + l + o;
            i.setAttribute("aria-label", "Share to " + o);
            i.setAttribute("title", "Share to " + o);
            i.target = "_blank";
            var c = e[o];
            var u = s;
            if (o === "twitter") {
                c += "&via=" + encodeURIComponent(m[o])
            } else {
                u = s + " via @" + m[o]
            }
            c = c.replace("{text}", encodeURIComponent(u));
            c = c.replace("{url}", encodeURIComponent(d));
            if (o === "weibo" && f) {
                c += "&pic=" + encodeURIComponent(f)
            }
            i.href = c;
            i.onclick = function(t) {
                t.preventDefault && t.preventDefault();
                window.open(c, "_blank", "width=615,height=505")
            };
            if(o=="weibo") {i.innerHTML="&#x3433;";i.style.fontSize="29px";}
            n.appendChild(i);


            var v = h[o];
            if (v && p) {
                var b = document.createElement("span");
                n.appendChild(b);
                b.className = "hide";
                var w = t.getAttribute("data-sameas");
                w = w ? w.split(/\s+/) : [];
                w.push(d);
                try {
                    a(w, v, function(t) {
                        b.innerHTML = r(t);
                        b.className = "social-button-count";
                        setTimeout(function() {
                            b.style.marginLeft = "-" + Math.floor(b.clientWidth / 2) + "px"
                        }, 300)
                    })
                } catch (g) {
                    n.removeChild(b)
                }
            }
            t.appendChild(n);
            return n
        }
        v("twitter");
        v("facebook");
        v("weibo")
    }
    t.exports = n;

    function r(t) {
        var e = t / 1e6;
        if (e > 1) {
            return Math.round(e * 100) / 100 + "M"
        }
        e = t / 1e3;
        if (e > 1) {
            return Math.round(e * 100) / 100 + "K"
        }
        return t
    }

    function a(t, e, o) {
        var n = t.length;
        var r = 0;
        var a = 0;
        var i = [];
        while (a < n && r < n) {
            e(t[a], function(t) {
                r += 1;
                i.push(t);
                if (r === n) {
                    var e = 0;
                    for (var a = 0; a < i.length; a++) {
                        e += i[a]
                    }
                    o(e)
                }
            });
            a += 1
        }
    }

    function i(t, e) {
        var o = "https://graph.facebook.com/fql?q=";
        var n = "SELECT share_count FROM link_stat WHERE url = '" + t + "'";
        d(o + encodeURIComponent(n), function(t) {
            e(t.data[0]["share_count"])
        })
    }

    function c(t, e) {
        var o = "https://cdn.api.twitter.com/1/urls/count.json?url=";
        if (location.protocol === "http:") {
            o = "http://urls.api.twitter.com/1/urls/count.json?url="
        }
        d(o + encodeURIComponent(t), function(t) {
            e(t.count)
        })
    }

    function u(t, e) {
        var n = "https://api.weibo.com/2/short_url/shorten.json?source=";
        n += encodeURIComponent(o) + "&url_long=";
        n += encodeURIComponent(t);
        d(n, function(t) {
            var r = t.data.urls[0].url_short;
            n = "https://api.weibo.com/2/short_url/share/counts.json?source=";
            n += encodeURIComponent(o) + "&url_short=";
            n += encodeURIComponent(r);
            d(n, function(t) {
                e(parseInt(t.data.urls[0].share_counts, 10))
            })
        })
    }
    var l = {};
    var s = 0;

    function d(t, e) {
        if (l[t]) {
            return e(l[t])
        }
        var o = "_social_" + s;
        var n;
        if (~t.indexOf("?")) {
            n = t + "&"
        } else {
            n = t + "?"
        }
        var r = document.createElement("script");
        r.src = n + "callback=" + o;
        r.async = true;
        r.defer = true;
        window[o] = function(o) {
            l[t] = o;
            e(o)
        };
        r.onload = function() {
            delete window[o]
        };
        setTimeout(function() {
            document.body.removeChild(r)
        }, 1e3);
        document.body.appendChild(r);
        s += 1
    }

    function f(t) {
        if (document.querySelectorAll) {
            return document.querySelectorAll("." + t)
        }
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(t)
        }
        var e = document.getElementsByTagName("div");
        var o = [];
        for (var n = 0; n < e.length; n++) {
            if (e[n].className.split(" ").indexOf(t)) {
                o.push(e[n])
            }
        }
        return o
    }
    var p = f("social-button");
    for (var m = 0; m < p.length; m++) {
        n(p[m])
    }
})();