/*global Chedz, _console*/
var VERSION = "1.0.0-beta.22";
window.onload = function() {

    document.getElementById("code").onclick = function() {
        document.getElementById("_term_type").focus();
    };

    function GetPrompt() {
        var node = document.getElementsByClassName("_prompt")[0].cloneNode();
        node.innerHTML = document.getElementsByClassName("_prompt")[0].innerHTML;
        return node;
    }

    var REPL = {
        redraw: function() {
            document.getElementById("_term_type").focus();
            if (typeof window.getSelection != "undefined" &&
                typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(document.getElementById("_term_type"));
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(document.getElementById("_term_type"));
                textRange.collapse(false);
                textRange.select();
            }
            document.getElementById("code").scrollTop = document.getElementById("code").scrollHeight;
        },
        exec: function(text) {
            var txt;
            try {
                var cheddar = (Chedz(text) || "");
                txt = document.createTextNode(cheddar || "");
            }
            catch (e) {
                var msg = document.createTextNode(" " + (e.message || e.toString()) + "\n");
                txt = document.createElement("span");
                txt.className = "er_msg";
                txt.appendChild(msg);
            }
            var elm = document.createElement("span");
            elm.className = "remain";
            elm.appendChild(txt);
            document.getElementById("_term").insertBefore(elm, document.getElementById("_term_type"));

            REPL.redraw();
        },
        log: function(text, where, classes) {
            if (typeof text !== "string") {
                (text ? _console.log : alert)('Cheese Police have been called.... text was not a string');
                text = text.toString();
            }
            var txt = document.createTextNode(
                (text || "").split("\n")
                .map(function(line) {
                    return " " + line;
                })
                .join("\n") + "\n"
            );
            var elm = document.createElement("span");
            elm.className = "remain " + classes;
            elm.appendChild(txt);
            if (where === 'prepend') {
                document.getElementById("_term").insertBefore(elm,
                    document.getElementById("_term").firstChild
                );
            }
            else {
                document.getElementById("_term").insertBefore(elm, document.getElementById("_term_type"));
            }
        }
    };

    // USE _console instead!!!
    window._console = window.console;
    window.console = REPL;
    // No need, fixed

    REPL.log("\nCheddar v" + VERSION + " (interactive)\n" +
        "run `help` to get started" + "\n", 'prepend');

    // For navigation through previous things
    var innav = false;
    var nav = [];
    var navindex = 0;

    document.getElementById("_term_type").onkeydown = function(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            var msg = document.createElement("span");
            msg.className = "remain history";
            msg.innerHTML = this.innerHTML + "<br>";
            this.parentNode.insertBefore(msg, this);

            var _prompt = GetPrompt();
            var text = this.textContent.trim();
            if (text === "clear") {
                [].forEach.call(document.querySelectorAll(
                    "._prompt:not(:last-child)" + "," +
                    ".remain"
                ), function(elem) {
                    elem.parentNode.removeChild(elem);
                });
            }
            else if (text === "help") {
                REPL.log("\n" +
                    "Welcome to Cheddar!\n\n" +
                    "If you are using Cheddar for the first time, we reccomend following\n" +
                    "the getting started guide at: http://cheddar.vihan.org/quickstart\n\n" +
                    "The following commands are available: \n" +
                    "   help  - outputs this\n" +
                    "   clear - clears the screen" +
                    "\n");
            }
            else {
                REPL.exec(this.textContent || "");
            }

            this.parentNode.insertBefore(_prompt, this);
            this.innerHTML = "";
            this.focus();

            REPL.redraw();
        }
        else if (e.keyCode === 38) {
            // Up key
            if (!innav) {
                // start nav
                nav = [
                    document.getElementById("_term_type").innerHTML
                ].concat(
                    [].map.call(document.querySelectorAll('.history'), function(text) {
                        return text.innerHTML;
                    }).filter(function(item) {
                        return !!item.trim();
                    }).reverse()
                );

                innav = true;
                navindex = 0;
            }

            if (nav[navindex + 1]) {
                document.getElementById("_term_type").innerHTML = nav[++navindex].trim();
                document.getElementById("_term_type").focus();
            }

            e.preventDefault();

            REPL.redraw();
        }
        else if (e.keyCode === 40 && innav) {
            e.preventDefault();
            // Down key & in navigation
            if (navindex > 0) {
                document.getElementById("_term_type").innerHTML = nav[--navindex].trim();
                document.getElementById("_term_type").focus();
            }

            if (navindex < 1) {
                innav = false;
            }

            REPL.redraw();
        }
    };

};
