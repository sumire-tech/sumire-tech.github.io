const { createApp, ref, reactive, toRefs, computed, watch } = Vue;

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

        //--汎用関数--

        //ファイルアップロード
        const handleFileUpload = (event, filesRef, selectedMap, contentMap) => {
            const files = event.target.files;
            if (!files.length) return;
            
            filesRef.value = Array.from(files);
            
            filesRef.value.forEach(file => {
                if (!(file.name in selectedMap)) selectedMap[file.name] = false;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    contentMap[file.name] = e.target.result;
                };
                reader.readAsText(file);
            });
        };
        
        //行数カウント
        const getLineCount = (fileContentsMap, fileName) => {
            if (!fileContentsMap[fileName]) return 0;
            return fileContentsMap[fileName].split(/\r?\n/).filter(line => line.trim() !== "").length;
        };

        //先頭n行取得
        const getFirstNLines = (text, n) => {
            if (!text) return "";
            return text
            .split(/\r?\n/)
            .slice(0, n)
            .join("\n");
        };

        //末尾n行取得
        const getLastNLines = (text, n) => {
            if (!text) return "";
            const lines = text.split(/\r?\n/);
            return lines.slice(-n).join("\n");
        };

        // タブを置換して先頭10行取得
        const getTabReplacedFirst10 = (text) => {
            if (!text) return "";
            const first10 = text.split(/\r?\n/).slice(0, 10);
            const replaceChar = tabReplaceChar.value === 'comma' ? ',' : ' ';
            return first10.map(line => line.replace(/\t/g, replaceChar)).join("\n");
        };

        // 保存
        const downloadConverted = (fileName) => {
            const content = getTabReplacedFirst10(state_2.q13Contents[fileName]);
            const blob = new Blob([content], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName.replace(/\.[^/.]+$/, "") + "_converted.txt";
            link.click();
            URL.revokeObjectURL(link.href);
        };

        //------

        const q10Files = ref([]);
        const q10Selected = reactive({});
        const q10Contents = reactive({});

        const onQ10FileUpload = (event) => {
            handleFileUpload(event, q10Files, q10Selected, q10Contents);
        };

        const q11Files = ref([]);
        const q11Selected = reactive({});
        const q11Contents = reactive({});

        const onQ11FileUpload = (event) => {
            handleFileUpload(event, q11Files, q11Selected, q11Contents);
        };

        const q11_displayLines = ref(10);


        const q12Files = ref([]);
        const q12Selected = reactive({});
        const q12Contents = reactive({});

        const onQ12FileUpload = (event) => {
            handleFileUpload(event, q12Files, q12Selected, q12Contents);
        };

        const q12_displayLines = ref(10);

        //Q13,Q14
        const state_2 = reactive({
            q13Files: [],
            q13Selected: {},
            q13Contents: {},

            q14Files: [],
            q14Selected: {},
            q14Contents: {},
            extractedResults: {},
            columnIndex: 1,
        });

        const { q13Files, q13Selected, q13Contents } = toRefs(state_2);

        const tabReplaceChar = ref('space');

        const onQ13FileUpload = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            q13Files.value = [file];
            q13Selected.value[file.name] = true;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                q13Contents.value[file.name] = e.target.result;
            };
            reader.readAsText(file);
        };

        const { q14Files, q14Selected, q14Contents, columnIndex, extractedResults } = toRefs(state_2);

        const onQ14FileUpload = (event) => {
          handleFileUpload(event, q14Files, q14Selected.value, q14Contents.value);
        };

        const extractColumn = (fileName) => {
            const text = q14Contents.value[fileName];
            if (!text) return;
            
            const lines = text.split(/\r?\n/).slice(0, 10);
            const col = columnIndex.value - 1;
            
            const result = lines
            .map(line => {
                const cols = line.split("\t");
                return cols[col] !== undefined ? cols[col] : "";
            })
            .join("\n");
            
            extractedResults.value[fileName] = result;
        };




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
            q10Files,
            q10Selected,
            q10Contents,
            onQ10FileUpload,
            getLineCount, 
            onQ11FileUpload,
            q11Files,
            q11Selected,
            q11Contents,
            getFirstNLines,
            q11_displayLines,
            getLastNLines,
            onQ12FileUpload,
            q12Files,
            q12Selected,
            q12Contents,
            q12_displayLines,
            ...toRefs(state_2),
            onQ13FileUpload,
            tabReplaceChar,
            getTabReplacedFirst10,
            downloadConverted,
            onQ14FileUpload,
            extractColumn,
        }

    }
}).mount('#app');
