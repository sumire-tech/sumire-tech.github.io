const { createApp, reactive, toRefs, computed, watch } = Vue;

createApp({
    setup(){
        
        const chapters = [
            { 
                title: "第1章: 準備運動", 
                description: `
                <p>文字列を操作する基本問題を扱います。</p>
                `,
                questions: Array.from({ length: 10 }, (_, i) => i) 
            },
            { 
                title: "第2章: UNIXコマンド", 
                description: `
                <p>タブ区切りのデータについて処理を行います。</p>
                `,
                questions: Array.from({ length: 10 }, (_, i) => i + 10) 
            },
            { 
                title: "第3章: 正規表現", 
                description: `
                <p>正規表現を用いてテキストを抽出・変換します。</p>
                `,
                questions: Array.from({ length: 10 }, (_, i) => i + 20) 
            },
            { 
                title: "第4章: 言語解析", 
                description: `
                <p>基本的な言語解析を行います。</p>
                `,
                questions: Array.from({ length: 10 }, (_, i) => i + 30) 
            },
        ];

        const state = reactive({
            currentPage: 'home',
            selectedPage: '',
            currentChapter: 0,
            chapters,

            //Q.00
            q00_str1: 'パトカー',
            q00_str2: 'タクシー',

            //Q.01
            q01_str: 'パタトクカシーー',

            //Q.02
            q02_str: 'stressed',

            //Q.03
            q03_str: 'Now I need a drink, alcoholic of course, after the heavy lectures involving quantum mechanics.',

            //Q.04
            q04_str: 'Hi He Lied Because Boron Could Not Oxidize Fluorine. New Nations Might Also Sign Peace Security Clause. Arthur King Can.',

            //Q.05
            q05_n: 2,
            q05_str: 'I am an NLPer',

            //Q.06
            q06_n: 2,
            q06_x: 'paraparaparadise',
            q06_y: 'paragraph',
            q06_judge: 'se',

            //Q.07
            q07_template: '{x}時の{y}は{z}',
            q07_x: '12',
            q07_y: '気温',
            q07_z: '22.4',

            //Q.08
            q08_plain: 'Now I need a drink, alcoholic of course, after the heavy lectures involving quantum mechanics.',
            q08_cipher: 'Nld I mvvw z wirmp, zoxlslorx lu xlfihv, zugvi gsv svzeb ovxgfivh rmeloermt jfzmgfn nvxszmrxh.',

            //Q.09
            q09_str: 'I couldn’t believe that I could actually understand what I was reading : the phenomenal power of the human mind .',
            q09_answer: '',
        });

        //標準的な関数------------------------------------------------------------------

        const setPage = (pageName) => {
            state.currentPage = pageName;
        };

        const backHome = () =>{
            state.currentPage = 'home';
        };

        const prevChapter = () => {
            if (state.currentChapter > 0) state.currentChapter--;
        };
        
        const nextChapter = () => {
            if (state.currentChapter < state.chapters.length - 1) state.currentChapter++;
        };


        //-----------------------------------------------------------------------------

        //問題ごとの関数----------------------------------------------------------------

        //第一章
        const q00_answer = computed(() => {
            let result = "";
            const maxLen = Math.max(state.q00_str1.length, state.q00_str2.length);
            for (let i = 0; i < maxLen; i++) {
                const s1 = state.q00_str1[i] || "";
                const s2 = state.q00_str2[i] || "";
                result += s1 + s2;
            }
            return result;
        });

        const q01_answer = computed(() => {
            return state.q01_str
            .split("")
            .filter((_, i) => (i+1) % 2 === 0)
            .join("");
        });

        const q02_answer = computed(() => {
            return state.q02_str
            .split("")
            .reverse()
            .join("");
        });

        const q03_answer = computed(() => {
            const words = state.q03_str.split(" ");
            const cleaned = words.map(w => w.replace(/[.,:;]/g, ""));
            return cleaned.map(w => w.length);
        });

        const q04_answer = computed(() => {
            const num_list = [0,4,5,6,7,8,14,15,18];
            const words = state.q04_str.split(" ");
            const word_list = words.map(w => w.replace(/[.,]/g, ""));
            const ans = {};
            word_list.forEach((word, idx) => {
                let w = (num_list.includes(idx)) ? word.slice(0,1) : word.slice(0,2);
                ans[idx+1] = w;
            });
            return ans;
        });

        //Q05,Q06で使用するn-gram関数
        const nGram = (n, input) => {
            const ans = [];
            if (typeof input === "string") {
                for (let i = 0; i < input.length - n + 1; i++) {
                    ans.push(input.slice(i, i+n));
                }
            } else if (Array.isArray(input)) {
                for (let i = 0; i < input.length - n + 1; i++) {
                    ans.push(input.slice(i, i+n));
                }
            }
            return ans;
        };

        const q05_charNgram = computed(() => nGram(state.q05_n, state.q05_str));
        const q05_wordNgram = computed(() => nGram(state.q05_n, state.q05_str.split(/\s+/)));


        const q06_x_result = computed(() => new Set(nGram(state.q06_n, state.q06_x)));
        const q06_y_result = computed(() => new Set(nGram(state.q06_n, state.q06_y)));

        const q06_xory = computed(() => {
            return Array.from(
                new Set ([...q06_x_result.value, ...q06_y_result.value]))
                .join(",");
        });

        const q06_xandy = computed(() => {
            return Array.from(
                new Set ([...q06_x_result.value].filter(x => q06_y_result.value.has(x))))
                .join(",")
        });

        const q06_xminusy = computed(() => {
            return Array.from(
                new Set ([...q06_x_result.value].filter(x => !q06_y_result.value.has(x))))
                .join(",")
        });

        const q06_judge_x = computed(() => {
            const judge = (state.q06_judge || "").trim();
            if (!judge) return "";
            return q06_x_result.value.has(judge) ? "含まれる" : "含まれない";
        });

        const q06_judge_y =computed(() => {
            const judge = (state.q06_judge || "").trim();
            if (!judge) return "";
            return q06_y_result.value.has(judge) ? "含まれる" : "含まれない";
        });

        const q07_answer = computed(() => {
            let result = state.q07_template || "";
            
            result = result.replace(/{x}/g, state.q07_x || "");
            result = result.replace(/{y}/g, state.q07_y || "");
            result = result.replace(/{z}/g, state.q07_z || "");
            return result;
        });

        // 暗号化・復号化関数
        const cipher = (str) => {
            let result = "";
            for (let char of str) {
                if (char >= 'a' && char <= 'z') {
                    result += String.fromCharCode(219 - char.charCodeAt(0));
                } else {
                    result += char;
                }
            }
            return result;
        };

        //更新を監視する(q8)
        let updating = false;
        
        watch(() => state.q08_plain, (newVal) => {
            if (updating) return;
            updating = true;
            state.q08_cipher = cipher(newVal);
            updating = false;
        });
        
        watch(() => state.q08_cipher, (newVal) => {
            if (updating) return;
            updating = true;
            state.q08_plain = cipher(newVal);
            updating = false;
        });
        //-----

        const q09_shuffle = () => {
            const input = state.q09_str;
            
            const words = input.split(" ");
            const processed = words.map(word => {
                if (word.length > 4) {
                    const first = word[0];
                    const middle = word.slice(1, -1).split("");
                    const last = word[word.length - 1];
                    
                    for (let i = middle.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [middle[i], middle[j]] = [middle[j], middle[i]];
                    }
                    
                    return first + middle.join("") + last;
                } else {
                    return word;
                }
            });
            state.q09_answer = processed.join(" ");
        };

        //第二章
        
        

        //-----------------------------------------------------------------------------

        return {
            ...toRefs(state),
            setPage,
            backHome,
            prevChapter,
            nextChapter,
            q00_answer,
            q01_answer,
            q02_answer,
            q03_answer,
            q04_answer,
            q05_charNgram,
            q05_wordNgram,
            q06_x_result,
            q06_y_result,
            q06_xory,
            q06_xandy,
            q06_xminusy,
            q06_judge_x,
            q06_judge_y,
            q07_answer,
            q09_shuffle,
        }

    }
}).mount('#app');