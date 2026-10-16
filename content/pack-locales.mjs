// Authored product introductions. Fluent editorial acceptance is tracked separately.
import { languagePacks } from './language-packs.mjs';

const copy = {
  pt: [
    'App para compor músicas e escrever letras', 'Escreva sua letra sobre uma instrumental, explore rimas em português do Brasil e grave ideias no mesmo projeto. Cadence está disponível para Android, iPhone e iPad.',
    'Rimas em português do Brasil', 'Baixe o pacote Português (Brasil) com conexão à internet. Depois, o motor de rimas funciona no aparelho. O pacote de Portugal é uma opção separada. Cante a frase para conferir as vogais nasais, os acentos e as terminações na sua pronúncia; uma sugestão não substitui sua escuta.',
    'Do type beat à primeira gravação', 'Importe um áudio que você tenha permissão para usar. Marque A e B para repetir um trecho e escreva junto ao player. Grave uma ideia de voz, compare versões e organize verso e refrão em seções. A letra e a interpretação continuam sendo suas.',
    'O que está incluído', 'Comece com três notas gratuitas. O fluxo completo de Draft para DAW, com arranjo e exportação, exige Pro. Consulte os planos na loja. O pacote de rimas não traduz toda a interface nem garante transcrição em português. Exporte gravações importantes antes de trocar de aparelho: a sincronização da conta não é backup de todas as tomadas.',
    'Idiomas', 'Ir para o conteúdo', 'Guia de recursos (em inglês)', 'Baixar', 'Perguntas frequentes', 'Posso escrever e gravar sobre uma instrumental?', 'Sim. Importe um arquivo autorizado, repita um trecho com A–B e grave suas ideias junto da letra.',
  ],
  'pt-pt': [
    'Aplicação para escrever letras de músicas', 'Junte a letra, a instrumental e as gravações na mesma canção. Escreva com apoio de rimas em português de Portugal no Cadence para Android, iPhone e iPad.',
    'Escolher português de Portugal', 'Transfira o pacote Português (Portugal) enquanto tem ligação à internet. O motor de rimas funciona depois no dispositivo. O português do Brasil tem um pacote distinto. Ouça as vogais átonas na frase que vai cantar: a escrita, por si só, não determina a duração nem a rima.',
    'Escrever sobre um beat e guardar a ideia', 'Importe um ficheiro áudio que tenha autorização para utilizar. Defina os pontos A e B para repetir uma passagem. Escreva junto do leitor, grave uma ideia de voz e compare versões antes de organizar as secções. Pode começar pelo verso ou pelo refrão.',
    'Planos e limites', 'Comece com três notas gratuitas. O percurso completo de Draft para DAW, incluindo arranjo e exportação, requer Pro; consulte as condições na loja. Um pacote de rimas não significa que toda a interface esteja traduzida nem garante a transcrição. Exporte as gravações importantes antes de mudar de dispositivo: sincronizar a conta não guarda uma cópia de todas as tomadas.',
    'Idiomas', 'Saltar para o conteúdo', 'Guia de funcionalidades (em inglês)', 'Transferir', 'Perguntas frequentes', 'Posso escrever e gravar sobre uma instrumental?', 'Sim. Importe um ficheiro autorizado, repita uma passagem com A–B e grave as suas ideias junto da letra.',
  ],
  de: [
    'App zum Songtexte schreiben und Aufnehmen', 'Schreibe deine eigenen Texte zum Beat, erkunde deutsche Reime und halte Gesangsideen im selben Song fest. Cadence gibt es für Android, iPhone und iPad.',
    'Deutsche Reime im eigenen Text prüfen', 'Lade das Sprachpaket Deutsch mit einer Internetverbindung herunter. Die Reimsuche der App läuft anschließend auf dem Gerät. Probiere zusammengesetzte Wörter in der ganzen Zeile aus: Betonung, Länge und Aussage müssen zur Aufnahme passen. Ein ähnliches Wortende allein entscheidet den Reim nicht.',
    'Vom Type Beat zur Songskizze', 'Importiere eine Audiodatei, die du verwenden darfst. Setze A und B, um einen kurzen Abschnitt zu wiederholen, und schreibe neben dem Player. Nimm eine Sprachidee auf, vergleiche Fassungen und ordne Strophe und Refrain in Abschnitten. Du schreibst und singst den Song selbst.',
    'Sprachpaket, Oberfläche und Pro', 'Du kannst mit drei kostenlosen Notizen anfangen. Der vollständige Weg von Draft zur DAW mit Arrangement und Export gehört zu Pro; die aktuellen Angebote stehen im Store. Ein Reimpaket übersetzt nicht automatisch alle Bedienelemente und garantiert keine Transkription. Exportiere wichtige Aufnahmen vor einem Gerätewechsel. Die Kontosynchronisierung ist kein Backup aller Takes.',
    'Sprachen', 'Zum Inhalt springen', 'Funktionsanleitung (Englisch)', 'Herunterladen', 'Häufige Fragen', 'Kann ich zu einem Beat schreiben und aufnehmen?', 'Ja. Importiere eine erlaubte Audiodatei, wiederhole einen Abschnitt mit A–B und halte deine Aufnahme beim Text fest.',
  ],
  it: [
    'App per scrivere testi di canzoni e registrare idee', 'Scrivi le tue parole su una base, esplora le rime italiane e conserva le registrazioni nello stesso brano. Cadence è disponibile per Android, iPhone e iPad.',
    'Il pacchetto di rime in italiano', 'Scarica il pacchetto Italiano mentre sei online. Il motore di rime funziona poi sul dispositivo. Ascolta la vocale accentata e i suoni che seguono; canta le vocali vicine come intendi eseguirle. Il numero scritto di sillabe non decide da solo il fraseggio.',
    'Dalla base alla prima demo', 'Importa un file audio che hai il permesso di usare. Imposta A e B per ripetere un passaggio e scrivi accanto al lettore. Registra un promemoria vocale, confronta le versioni e organizza strofa e ritornello in sezioni. Testo e interpretazione restano tuoi.',
    'Piani e limiti', 'Inizia con tre note gratuite. Il percorso completo da Draft alla DAW, con arrangiamento ed esportazione, richiede Pro: controlla le offerte nello store. Il pacchetto di rime non traduce tutta l’interfaccia e non garantisce la trascrizione. Esporta le registrazioni importanti prima di cambiare dispositivo: la sincronizzazione dell’account non è un backup di tutte le take.',
    'Lingue', 'Vai al contenuto', 'Guida alle funzioni (in inglese)', 'Scarica', 'Domande frequenti', 'Posso scrivere e registrare su una base?', 'Sì. Importa un file autorizzato, ripeti un passaggio con A–B e conserva la registrazione insieme al testo.',
  ],
  ru: [
    'Приложение для написания текстов песен', 'Пишите свои строки под бит, ищите русские рифмы и записывайте вокальные идеи в одном проекте. Cadence доступен на Android, iPhone и iPad.',
    'Русские рифмы и ударение', 'Скачайте пакет Русский при подключении к интернету. Затем движок рифм работает на устройстве. Сохраняйте текст кириллицей и проверяйте ударение в нужном слове. Произнесите строку целиком: похожее окончание ещё не определяет звучание в песне.',
    'От бита к записи', 'Импортируйте аудиофайл, который вы имеете право использовать. Установите точки A и B, чтобы повторять фрагмент, и пишите рядом с плеером. Запишите голосовую идею, сравните варианты и расположите куплеты и припев в секциях. Слова и исполнение создаёте вы.',
    'Что нужно знать перед началом', 'Начните с трёх бесплатных заметок. Полный путь от Draft к DAW, включая аранжировку и экспорт, требует Pro; условия смотрите в магазине. Пакет рифм не означает перевод всего интерфейса и не гарантирует распознавание речи. Экспортируйте важные записи перед сменой устройства: синхронизация аккаунта не сохраняет резервную копию всех дублей.',
    'Языки', 'Перейти к содержимому', 'Руководство по функциям (на английском)', 'Скачать', 'Вопросы и ответы', 'Можно писать и записывать голос под бит?', 'Да. Импортируйте разрешённый аудиофайл, повторяйте фрагмент с помощью A–B и храните запись вместе с текстом.',
  ],
  ar: [
    'تطبيق لكتابة كلمات الأغاني وتسجيل الأفكار', 'اكتب كلماتك على إيقاع موسيقي، واستكشف القوافي العربية، واحتفظ بالتسجيلات داخل الأغنية نفسها. يتوفر Cadence على Android وiPhone وiPad.',
    'حزمة القوافي العربية ولهجتك', 'نزّل حزمة العربية أثناء الاتصال بالإنترنت. يعمل محرك القوافي بعد ذلك على الجهاز. اكتب بالحروف العربية وجرّب الكلمات باللهجة التي تغني بها؛ تشابه النهايات المكتوبة لا يضمن النطق نفسه في كل اللهجات. راجع أيضًا ترتيب النص عند مزج العربية بالحروف اللاتينية.',
    'من الإيقاع إلى التسجيل الأول', 'استورد ملفًا صوتيًا تملك إذن استخدامه. حدّد النقطتين A وB لتكرار مقطع قصير واكتب بجانب المشغّل. سجّل فكرة صوتية، وقارن النسخ، ثم رتّب المقاطع واللازمة. أنت من يكتب الكلمات ويؤدي الأغنية.',
    'الخطط وحدود الدعم', 'ابدأ بثلاث ملاحظات مجانية. يتطلب المسار الكامل من Draft إلى DAW، بما فيه الترتيب والتصدير، اشتراك Pro؛ راجع المتجر للتفاصيل. حزمة القوافي لا تعني ترجمة الواجهة بالكامل ولا تضمن دقة التفريغ الصوتي. صدّر التسجيلات المهمة قبل تغيير الجهاز؛ مزامنة الحساب ليست نسخة احتياطية لكل التسجيلات.',
    'اللغات', 'انتقل إلى المحتوى', 'دليل الميزات بالإنجليزية', 'تنزيل', 'أسئلة شائعة', 'هل يمكنني الكتابة والتسجيل على إيقاع موسيقي؟', 'نعم. استورد ملفًا مسموحًا باستخدامه، وكرّر مقطعًا باستخدام A–B، واحتفظ بتسجيلك مع الكلمات.',
  ],
  hi: [
    'गाने के बोल लिखने और रिकॉर्ड करने का ऐप', 'बीट पर अपने बोल लिखें, हिंदी तुक खोजें और आवाज़ के विचार उसी गाने में रखें। Cadence Android, iPhone और iPad पर उपलब्ध है।',
    'हिंदी भाषा पैक और आपका उच्चारण', 'इंटरनेट से जुड़े रहते हुए हिन्दी पैक डाउनलोड करें। इसके बाद ऐप का तुक इंजन डिवाइस पर चलता है। हिंदी पैक जाँचते समय देवनागरी में लिखें। रोमन हिंदी की वर्तनी अलग हो सकती है; हर सुझाव को अपनी पूरी पंक्ति में बोलकर सुनें।',
    'बीट से पहली रिकॉर्डिंग तक', 'ऐसी ऑडियो फ़ाइल आयात करें जिसे इस्तेमाल करने की अनुमति आपके पास हो। छोटा हिस्सा दोहराने के लिए A और B तय करें और प्लेयर के पास बोल लिखें। आवाज़ का विचार रिकॉर्ड करें, अलग संस्करण सुनें और अंतरे व मुखड़े को सेक्शन में व्यवस्थित करें। गीत आप लिखते और गाते हैं।',
    'शुरुआत और सीमाएँ', 'तीन मुफ़्त नोट से शुरुआत करें। अरेंजमेंट और एक्सपोर्ट सहित Draft से DAW तक के पूरे काम के लिए Pro चाहिए; स्टोर में योजना देखें। तुक पैक का मतलब पूरे इंटरफ़ेस का अनुवाद या सही ट्रांसक्रिप्शन की गारंटी नहीं है। डिवाइस बदलने से पहले ज़रूरी रिकॉर्डिंग एक्सपोर्ट करें। अकाउंट सिंक सभी टेक का बैकअप नहीं है।',
    'भाषाएँ', 'मुख्य सामग्री पर जाएँ', 'फ़ीचर गाइड (अंग्रेज़ी में)', 'डाउनलोड', 'आम सवाल', 'क्या बीट पर लिखना और रिकॉर्ड करना संभव है?', 'हाँ। अनुमत ऑडियो फ़ाइल आयात करें, A–B से हिस्सा दोहराएँ और रिकॉर्डिंग को बोल के साथ रखें।',
  ],
  ko: [
    '가사 쓰기와 아이디어 녹음을 위한 작사 앱', '비트에 맞춰 직접 가사를 쓰고 한국어 라임을 찾아보세요. 가사와 녹음을 한 곡에 보관하는 Cadence는 Android, iPhone, iPad에서 사용할 수 있습니다.',
    '한국어 라임 팩과 실제 발음', '인터넷에 연결된 상태에서 한국어 팩을 다운로드하세요. 이후 앱의 라임 엔진은 기기에서 작동합니다. 한글로 가사를 쓰고 단어가 이어질 때의 발음을 들어보세요. 마지막 글자가 같다는 이유만으로 라임을 정하지 말고 받침과 문장 속 소리를 확인하세요.',
    '타입 비트에서 첫 녹음까지', '사용 권한이 있는 오디오 파일을 가져오세요. A와 B 지점으로 짧은 구간을 반복하며 플레이어 옆에서 가사를 씁니다. 음성 아이디어를 녹음하고 여러 버전을 비교한 다음 벌스와 후렴을 섹션으로 정리하세요. 가사와 노래는 직접 만듭니다.',
    '무료 시작과 지원 범위', '무료 노트 세 개로 시작할 수 있습니다. 편곡과 내보내기를 포함한 전체 Draft–DAW 작업에는 Pro가 필요합니다. 요금은 스토어에서 확인하세요. 라임 팩이 앱 화면 전체 번역이나 정확한 음성 변환을 보장하지는 않습니다. 기기를 바꾸기 전에 중요한 녹음을 내보내세요. 계정 동기화는 모든 테이크의 백업이 아닙니다.',
    '언어', '본문으로 이동', '기능 가이드 (영어)', '다운로드', '자주 묻는 질문', '비트에 맞춰 가사를 쓰고 녹음할 수 있나요?', '네. 사용 권한이 있는 오디오를 가져와 A–B 구간을 반복하고 가사와 함께 녹음을 보관할 수 있습니다.',
  ],
  he: [
    'אפליקציה לכתיבת שירים ולהקלטת רעיונות', 'כתבו מילים משלכם על ביט, חפשו חרוזים בעברית ושמרו את ההקלטות באותו שיר. Cadence זמינה ב־Android, ב־iPhone וב־iPad.',
    'חבילת עברית וההגייה שלכם', 'הורידו את חבילת עברית בזמן חיבור לאינטרנט. לאחר מכן מנוע החרוזים פועל במכשיר. מילה ללא ניקוד יכולה להיקרא ביותר מדרך אחת: בדקו את המשמעות ואת ההגייה שהתכוונתם אליהן. כשמשלבים עברית ואותיות לטיניות, בדקו גם את סדר הטקסט בשורה השמורה.',
    'מהביט להקלטה הראשונה', 'ייבאו קובץ שמע שיש לכם רשות להשתמש בו. סמנו נקודות A ו־B כדי לחזור על קטע קצר וכתבו ליד הנגן. הקליטו רעיון קולי, השוו גרסאות וסדרו את הבתים והפזמון במקטעים. המילים והביצוע נשארים שלכם.',
    'התחלה ותנאי שימוש', 'אפשר להתחיל עם שלוש רשומות חינמיות. המסלול המלא מ־Draft ל־DAW, כולל עיבוד וייצוא, דורש Pro; בדקו את התוכניות בחנות. חבילת חרוזים אינה מבטיחה שכל הממשק מתורגם או שהתמלול מדויק. ייצאו הקלטות חשובות לפני החלפת מכשיר: סנכרון החשבון אינו גיבוי של כל הטייקים.',
    'שפות', 'דלגו לתוכן', 'מדריך תכונות באנגלית', 'הורדה', 'שאלות נפוצות', 'אפשר לכתוב ולהקליט על ביט?', 'כן. ייבאו קובץ מורשה, חזרו על קטע עם A–B ושמרו את ההקלטה לצד המילים.',
  ],
  ja: [
    '歌詞を書いてアイデアを録音する作詞アプリ', 'ビートを聴きながら自分の歌詞を書き、日本語の韻を探し、録音を同じ曲にまとめましょう。CadenceはAndroid、iPhone、iPadで使えます。',
    '日本語パックと歌詞のリズム', 'インターネットに接続して日本語パックをダウンロードすると、アプリの韻エンジンは端末上で動作します。日本語の拍と英語の音節は同じではありません。長音や間も含めて実際に歌い、数値だけでリズムを判断しないでください。',
    'タイプビートから最初の録音へ', '使用する権利のある音声ファイルを読み込みます。AとBの位置を決めて短い区間を繰り返し、プレーヤーの横で歌詞を書きます。声のアイデアを録音し、別のテイクと聴き比べてから、バースやサビをセクションに整理しましょう。歌詞も歌唱も自分で作ります。',
    '無料で始める範囲と注意点', '無料のノート３つから始められます。アレンジと書き出しを含むDraftからDAWへの全工程にはProが必要です。プランはストアで確認してください。韻パックはアプリ画面全体の翻訳や正確な文字起こしを保証しません。機種変更の前に大切な録音を書き出してください。アカウントの同期は全テイクのバックアップではありません。',
    '言語', '本文へ移動', '機能ガイド（英語）', 'ダウンロード', 'よくある質問', 'ビートに合わせて作詞と録音ができますか？', 'はい。利用許可のある音声を読み込み、A–Bで区間を繰り返して、歌詞と録音を同じ曲に保存できます。',
  ],
  tr: [
    'Şarkı sözü yazma ve fikir kaydetme uygulaması', 'Beat üzerine kendi sözlerini yaz, Türkçe kafiyeleri keşfet ve ses kayıtlarını aynı şarkıda tut. Cadence Android, iPhone ve iPad için kullanılabilir.',
    'Türkçe kafiye paketi', 'İnternete bağlıyken Türkçe paketini indir. Ardından uygulamanın kafiye motoru cihazda çalışır. Noktalı ve noktasız i harflerini koru; eklerin benzemesi tek başına güçlü bir dize kurmaz. Öneriyi anlamıyla birlikte bütün cümlede söyleyerek dene.',
    'Type beat üzerinde yaz ve kaydet', 'Kullanma iznin olan bir ses dosyasını içe aktar. A ve B noktalarını belirleyip kısa bir bölümü döngüye al ve oynatıcının yanında yaz. Bir ses fikri kaydet, sürümleri karşılaştır ve kıta ile nakaratı bölümlere yerleştir. Sözleri yazan ve söyleyen sensin.',
    'Ücretsiz başlangıç ve sınırlar', 'Üç ücretsiz notla başlayabilirsin. Düzenleme ve dışa aktarma dahil Draft’tan DAW’a tam iş akışı Pro gerektirir; planları mağazada kontrol et. Kafiye paketi tüm arayüzün çevrildiğini veya doğru transkripsiyonu garanti etmez. Cihaz değiştirmeden önce önemli kayıtları dışa aktar. Hesap eşitleme tüm kayıtların yedeği değildir.',
    'Diller', 'İçeriğe geç', 'Özellik rehberi (İngilizce)', 'İndir', 'Sık sorulan sorular', 'Beat üzerine yazıp kayıt yapabilir miyim?', 'Evet. İzinli bir ses dosyasını içe aktar, A–B ile bir bölümü tekrarla ve kaydını sözlerle birlikte sakla.',
  ],
  id: [
    'Aplikasi menulis lirik lagu dan merekam ide', 'Tulis lirik sendiri di atas beat, cari rima bahasa Indonesia, dan simpan rekaman dalam lagu yang sama. Cadence tersedia untuk Android, iPhone, dan iPad.',
    'Paket rima bahasa Indonesia', 'Unduh paket Bahasa Indonesia saat terhubung ke internet. Setelah itu mesin rima aplikasi berjalan di perangkat. Tentukan apakah baris memakai bahasa formal atau percakapan. Coba saran dalam kalimat yang benar-benar akan kamu nyanyikan; jangan menukar makna hanya demi akhiran yang sama.',
    'Dari type beat ke rekaman pertama', 'Impor berkas audio yang boleh kamu gunakan. Tentukan titik A dan B untuk mengulang bagian pendek, lalu tulis di samping pemutar. Rekam ide suara, bandingkan versi, dan susun bait serta reff dalam bagian lagu. Kamu tetap menulis dan membawakan lagunya sendiri.',
    'Mulai gratis dan batas dukungan', 'Mulai dengan tiga catatan gratis. Alur lengkap dari Draft ke DAW, termasuk aransemen dan ekspor, memerlukan Pro; periksa paket di toko aplikasi. Paket rima tidak berarti seluruh antarmuka diterjemahkan atau transkripsi selalu akurat. Ekspor rekaman penting sebelum berganti perangkat. Sinkronisasi akun bukan cadangan untuk semua take.',
    'Bahasa', 'Lewati ke konten', 'Panduan fitur (bahasa Inggris)', 'Unduh', 'Pertanyaan umum', 'Bisakah saya menulis dan merekam di atas beat?', 'Ya. Impor audio yang diizinkan, ulangi bagian dengan A–B, dan simpan rekaman bersama lirik.',
  ],
  ms: [
    'Aplikasi menulis lirik lagu dan merakam idea', 'Tulis lirik sendiri mengikut beat, cari rima bahasa Melayu dan simpan rakaman dalam lagu yang sama. Cadence tersedia untuk Android, iPhone dan iPad.',
    'Pilih pakej Bahasa Melayu', 'Muat turun pakej Bahasa Melayu semasa bersambung ke internet. Enjin rima aplikasi kemudian berjalan pada peranti. Pakej bahasa Indonesia ialah pilihan berasingan. Uji kosa kata dan sebutan dalam persembahan anda, terutamanya apabila bertukar antara bahasa Melayu dengan bahasa Inggeris.',
    'Daripada beat kepada rakaman pertama', 'Import fail audio yang anda mempunyai kebenaran untuk gunakan. Tetapkan titik A dan B untuk mengulang bahagian pendek dan tulis di sebelah pemain. Rakam idea suara, bandingkan versi dan susun rangkap serta korus dalam bahagian lagu. Anda sendiri menulis dan menyanyikan lagu itu.',
    'Permulaan percuma dan had sokongan', 'Mulakan dengan tiga nota percuma. Aliran kerja lengkap daripada Draft kepada DAW, termasuk susunan dan eksport, memerlukan Pro; semak pelan di kedai aplikasi. Pakej rima tidak menjamin terjemahan seluruh antara muka atau transkripsi yang tepat. Eksport rakaman penting sebelum menukar peranti. Penyegerakan akaun bukan sandaran semua rakaman.',
    'Bahasa', 'Langkau ke kandungan', 'Panduan ciri (bahasa Inggeris)', 'Muat turun', 'Soalan lazim', 'Bolehkah saya menulis dan merakam mengikut beat?', 'Ya. Import audio yang dibenarkan, ulang bahagian dengan A–B dan simpan rakaman bersama lirik.',
  ],
  pl: [
    'Aplikacja do pisania tekstów piosenek', 'Pisz własne teksty do bitu, szukaj polskich rymów i zachowuj nagrania w tym samym utworze. Cadence działa na Androidzie, iPhonie i iPadzie.',
    'Polskie rymy w całym wersie', 'Pobierz pakiet Polski przy połączeniu z internetem. Silnik rymów działa później na urządzeniu. Zachowuj polskie znaki i słuchaj zbitek spółgłoskowych w całym nagraniu. Sprawdź, czy podobna końcówka wnosi dobry rym, czy tylko powtarza tę samą konstrukcję gramatyczną.',
    'Od bitu do pierwszego nagrania', 'Zaimportuj plik audio, którego wolno ci użyć. Ustaw punkty A i B, aby powtarzać krótki fragment, i pisz obok odtwarzacza. Nagraj pomysł głosowy, porównaj wersje i ułóż zwrotki oraz refren w sekcjach. Słowa i wykonanie tworzysz samodzielnie.',
    'Bezpłatny start i ograniczenia', 'Zacznij od trzech bezpłatnych notatek. Pełny przebieg od Draft do DAW, z aranżacją i eksportem, wymaga Pro; sprawdź plany w sklepie. Pakiet rymów nie oznacza przetłumaczenia całego interfejsu ani gwarancji poprawnej transkrypcji. Wyeksportuj ważne nagrania przed zmianą urządzenia. Synchronizacja konta nie jest kopią zapasową wszystkich podejść.',
    'Języki', 'Przejdź do treści', 'Przewodnik po funkcjach (po angielsku)', 'Pobierz', 'Pytania i odpowiedzi', 'Czy mogę pisać i nagrywać do bitu?', 'Tak. Zaimportuj dozwolony plik audio, zapętl fragment punktami A–B i zachowaj nagranie obok tekstu.',
  ],
  tl: [
    'App para sa pagsulat ng kanta at pagrekord ng ideya', 'Isulat ang sarili mong liriko sa beat, humanap ng tugma sa Filipino, at itabi ang mga rekording sa iisang kanta. May Cadence para sa Android, iPhone, at iPad.',
    'Filipino, Tagalog at Taglish', 'I-download ang Filipino pack habang may internet. Pagkatapos, sa device gumagana ang rhyme engine ng app. Filipino ang pangalan ng pack sa app. Kung Taglish ang kanta, sadyain ang paglipat ng wika at subukan ang diin sa buong linya; hindi pareho ang pagbigkas sa Filipino at English.',
    'Mula sa type beat hanggang unang rekording', 'Mag-import ng audio na may pahintulot kang gamitin. Itakda ang A at B para ulitin ang maikling bahagi at magsulat sa tabi ng player. Irekord ang ideya sa boses, ihambing ang mga bersiyon, at ayusin ang saknong at koro bilang mga seksiyon. Ikaw ang sumusulat at kumakanta.',
    'Libreng simula at mga limitasyon', 'Magsimula sa tatlong libreng note. Kailangan ng Pro para sa buong Draft-to-DAW na proseso, kasama ang arrangement at export; tingnan ang plano sa store. Hindi ibig sabihin ng rhyme pack na isinalin ang buong interface o garantisado ang transcription. I-export ang mahahalagang rekording bago magpalit ng device. Ang account sync ay hindi backup ng lahat ng take.',
    'Mga wika', 'Pumunta sa nilalaman', 'Gabay sa mga feature (English)', 'I-download', 'Mga karaniwang tanong', 'Puwede bang magsulat at magrekord sa beat?', 'Oo. Mag-import ng pinahihintulutang audio, ulitin ang bahagi gamit ang A–B, at itabi ang rekording kasama ng liriko.',
  ],
  vi: [
    'Ứng dụng viết lời bài hát và ghi âm ý tưởng', 'Tự viết lời trên nền beat, tìm vần tiếng Việt và giữ các bản thu trong cùng một bài hát. Cadence có trên Android, iPhone và iPad.',
    'Gói tiếng Việt và cách bạn hát', 'Tải gói Tiếng Việt khi có kết nối mạng. Sau đó bộ máy tìm vần của ứng dụng hoạt động trên thiết bị. Giữ đầy đủ dấu thanh và dấu nguyên âm trong bản nháp. Hãy hát cả câu để kiểm tra nghĩa và phát âm; phần kết giống nhau chưa đủ để quyết định câu hát.',
    'Từ type beat đến bản thu đầu tiên', 'Nhập tệp âm thanh mà bạn có quyền sử dụng. Đặt điểm A và B để lặp một đoạn ngắn, rồi viết bên cạnh trình phát. Ghi âm ý tưởng, so sánh các phiên bản và sắp xếp đoạn lời cùng điệp khúc thành các phần. Bạn là người viết và thể hiện bài hát.',
    'Bắt đầu miễn phí và giới hạn', 'Bắt đầu với ba ghi chú miễn phí. Toàn bộ quy trình Draft đến DAW, gồm sắp xếp và xuất âm thanh, cần Pro; xem gói trong cửa hàng. Gói vần không có nghĩa là toàn bộ giao diện đã được dịch hay bản chép lời luôn chính xác. Xuất các bản thu quan trọng trước khi đổi thiết bị. Đồng bộ tài khoản không phải bản sao lưu của mọi lần thu.',
    'Ngôn ngữ', 'Chuyển đến nội dung', 'Hướng dẫn tính năng (tiếng Anh)', 'Tải xuống', 'Câu hỏi thường gặp', 'Tôi có thể viết và ghi âm trên nền beat không?', 'Có. Nhập âm thanh được phép sử dụng, lặp một đoạn bằng A–B và lưu bản thu cùng lời bài hát.',
  ],
  yo: [
    'Ohun èlò fún kíkọ orin ní Yorùbá', 'Kọ ọ̀rọ̀ orin tirẹ sí orí beat, wá àwọn ọ̀rọ̀ tó jọra ní ìró, kí o sì pa àkọsílẹ̀ ohùn mọ́ sínú orin kan náà. Cadence wà fún Android, iPhone àti iPad.',
    'Àkójọpọ̀ èdè Yorùbá àti ìró ọ̀rọ̀', 'Ṣe ìgbàsílẹ̀ àkójọpọ̀ Yorùbá nígbà tí o ní ìsopọ̀ ayélujára. Ẹ̀rọ ìwá ìró yóò ṣiṣẹ́ lórí ẹ̀rọ rẹ lẹ́yìn náà. Má ṣe yọ àmì ohùn àti àmì abẹ́ lẹ́tà kúrò. Kọ orin náà, kí o sì gbọ́ bí ìró àti ìtumọ̀ ṣe bá orin mu; ìró tó jọra nìkan kò tó.',
    'Láti beat sí àkọsílẹ̀ ohùn', 'Gbé fáìlì ohùn tí o ní àṣẹ láti lò wọlé. Yan ibi A àti B láti tún apá kékeré kan ṣe. Kọ ọ̀rọ̀ orin lẹ́gbẹ̀ẹ́ ẹ̀rọ ìgbóhùn, ṣe àkọsílẹ̀ ohùn rẹ, kí o sì fi àwọn ẹ̀yà wé ara wọn. Ìwọ ni o ń kọ orin àti kọrin náà.',
    'Ìbẹ̀rẹ̀ àti ààlà iṣẹ́', 'Bẹ̀rẹ̀ pẹ̀lú àkọsílẹ̀ mẹ́ta lọ́fẹ̀ẹ́. Iṣẹ́ Draft sí DAW ní kíkún, pẹ̀lú títò orin àti fífi ohùn jáde, nílò Pro; wo ètò inú ilé ìtajà app. Àkójọpọ̀ ìró kì í ṣe ìtumọ̀ gbogbo ojú ìṣàkóso tàbí ìlérí àkọsílẹ̀ ọ̀rọ̀ láti ohùn tó pé. Fi àwọn àkọsílẹ̀ ohùn pàtàkì jáde kí o tó yí ẹ̀rọ padà. Sísopọ̀ àkọọ́lẹ̀ kì í ṣe àfipamọ́ gbogbo ohùn rẹ.',
    'Àwọn èdè', 'Lọ sí àkóónú', 'Ìtọ́sọ́nà iṣẹ́ (ní Gẹ̀ẹ́sì)', 'Ṣe ìgbàsílẹ̀', 'Ìbéèrè tí a sábà máa ń béèrè', 'Ṣé mo lè kọ orin àti ṣe àkọsílẹ̀ ohùn sí orí beat?', 'Bẹ́ẹ̀ ni. Gbé ohùn tí o ní àṣẹ láti lò wọlé, tún apá kan ṣe pẹ̀lú A–B, kí o sì pa ohùn àti ọ̀rọ̀ orin mọ́ papọ̀.',
  ],
  pcm: [
    'App wey you fit use write song for Naijá', 'Write your own lyrics on top beat, find rhyme ideas for Nigerian Pidgin, and keep your voice recordings inside the same song. Cadence dey for Android, iPhone and iPad.',
    'Nigerian Pidgin pack and how you dey talk', 'Download the Naijá pack when internet dey. After that, the app rhyme engine dey work for your device. Use the spelling and pronunciation wey you go perform. If you mix Pidgin with English or Yorùbá, test the whole line; the language packs no be the same thing.',
    'From type beat reach your first recording', 'Import audio wey you get permission to use. Set A and B so one short part go repeat while you write beside the player. Record your voice idea, compare versions, then arrange your verse and hook for sections. Na you dey write and perform the song.',
    'Free start and wetin Pro cover', 'You fit start with three free notes. The full Draft-to-DAW work, including arrangement and export, need Pro; check the plans for your store. Rhyme pack no mean say every app screen dey Pidgin, and e no guarantee correct transcription. Export important recordings before you change device. Account sync no be backup of all your takes.',
    'Languages', 'Go to the main content', 'Feature guide (English)', 'Download', 'Questions wey people dey ask', 'I fit write and record on top beat?', 'Yes. Import audio wey you get permission to use, repeat one part with A–B, and keep your recording with the lyrics.',
  ],
};

export const packLocales = languagePacks.filter(pack => copy[pack.id]).map(pack => {
  const [heading,intro,setupTitle,setup,beatTitle,beat,limitTitle,limits,languages,main,guide,download,questions,question,answer] = copy[pack.id];
  return {
    code:pack.route, hreflang:pack.googleHreflang, name:pack.name, direction:pack.direction,
    title:`${heading} | Cadence`, description:intro, heading,intro,
    appStore:`App Store · ${download}`, playStore:`Google Play · ${download}`,
    nav:languages,main,languages,questions,guide,support:'Support',privacy:'Privacy',terms:'Terms',
    sections:[{heading:setupTitle,html:`<p>${setup}</p>`},{heading:beatTitle,html:`<p>${beat}</p>`},{heading:limitTitle,html:`<p>${limits}</p>`}],
    faqs:[{question,answer}],
  };
});
