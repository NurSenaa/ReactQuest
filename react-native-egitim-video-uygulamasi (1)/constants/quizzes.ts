export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  lessonId: string;
  score: number;
  totalQuestions: number;
  completed: boolean;
  date: string;
}

export const QUIZ_STORAGE_KEY = 'quiz_results';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Component Nedir ve Nasıl Oluşturulur?
  {
    id: '1-1',
    lessonId: '1',
    question: 'React Native\'de bir function component nasıl oluşturulur?',
    options: [
      'function MyComponent() { return <View />; }',
      'class MyComponent { render() { return <View />; } }',
      'const MyComponent = <View />;',
      'new Component(<View />);'
    ],
    correctAnswer: 0,
    explanation: 'Function component, bir JavaScript fonksiyonu olarak tanımlanır ve JSX döndürür. En basit haliyle "function MyComponent() { return <View />; }" şeklinde yazılır.'
  },
  {
    id: '1-2',
    lessonId: '1',
    question: 'React Native\'de props nedir?',
    options: [
      'Componentlerin içinde tanımlanan değişkenler',
      'Parent componentten child componente aktarılan veriler',
      'Componentlerin state\'ini güncellemek için kullanılan fonksiyonlar',
      'Native modüllere erişim sağlayan API\'lar'
    ],
    correctAnswer: 1,
    explanation: 'Props (properties), parent componentten child componente veri aktarmak için kullanılan özelliklerdir. Child component, bu propsları parametre olarak alır ve kullanır.'
  },
  {
    id: '1-3',
    lessonId: '1',
    question: 'Aşağıdakilerden hangisi React Native\'de geçerli bir component değildir?',
    options: [
      '<View>',
      '<Div>',
      '<Text>',
      '<Image>'
    ],
    correctAnswer: 1,
    explanation: '<Div> HTML\'de kullanılan bir element olup, React Native\'de bulunmaz. React Native\'de <View> componenti benzer bir işlevi görür.'
  },
  
  // useState Hook'u: State Yönetimi
  {
    id: '2-1',
    lessonId: '2',
    question: 'useState hook\'u ne döndürür?',
    options: [
      'Sadece state değerini',
      'Sadece state\'i güncelleyen fonksiyonu',
      'State değeri ve state\'i güncelleyen fonksiyonu içeren bir dizi',
      'State değeri ve bir hata nesnesi'
    ],
    correctAnswer: 2,
    explanation: 'useState hook\'u, state değeri ve bu değeri güncelleyen bir fonksiyon içeren iki elemanlı bir dizi döndürür. Genellikle array destructuring ile [value, setValue] şeklinde kullanılır.'
  },
  {
    id: '2-2',
    lessonId: '2',
    question: 'Aşağıdaki useState kullanımlarından hangisi doğrudur?',
    options: [
      'const state = useState(0);',
      'const [count] = useState(0);',
      'const [count, setCount] = useState();',
      'const [count, setCount] = useState(0);'
    ],
    correctAnswer: 3,
    explanation: 'Doğru kullanım const [count, setCount] = useState(0); şeklindedir. İlk değer (0) başlangıç state değerini belirtir, count mevcut değeri, setCount ise bu değeri güncelleyen fonksiyondur.'
  },
  {
    id: '2-3',
    lessonId: '2',
    question: 'State güncellendiğinde ne olur?',
    options: [
      'Hiçbir şey olmaz, manuel olarak render etmek gerekir',
      'Sadece state değeri değişir, UI güncellenmez',
      'Component yeniden render edilir',
      'Tüm uygulama yeniden başlatılır'
    ],
    correctAnswer: 2,
    explanation: 'State güncellendiğinde, React otomatik olarak componenti yeniden render eder. Bu, UI\'ın güncel state değerini yansıtmasını sağlar.'
  },
  
  // useEffect Hook'u: Component Yaşam Döngüsü
  {
    id: '3-1',
    lessonId: '3',
    question: 'useEffect hook\'u ne zaman çalışır?',
    options: [
      'Sadece component ilk render edildiğinde',
      'Her render sonrasında',
      'Sadece belirtilen dependency\'ler değiştiğinde',
      'B ve C seçenekleri (dependency\'lere bağlı olarak)'
    ],
    correctAnswer: 3,
    explanation: 'useEffect, dependency array\'ine bağlı olarak çalışır. Boş bir array ([]) verilirse sadece ilk render\'da, hiç array verilmezse her render sonrasında, array içinde değerler varsa bu değerler değiştiğinde çalışır.'
  },
  {
    id: '3-2',
    lessonId: '3',
    question: 'useEffect içinde return edilen fonksiyon ne işe yarar?',
    options: [
      'Effect\'in çalışmasını engeller',
      'Component yeniden render edildiğinde çalışır',
      'Component unmount olduğunda veya effect yeniden çalışmadan önce cleanup işlemi yapar',
      'Asenkron işlemleri senkron hale getirir'
    ],
    correctAnswer: 2,
    explanation: 'useEffect içinde return edilen fonksiyon, cleanup (temizleme) fonksiyonudur. Component unmount olduğunda veya effect yeniden çalışmadan önce çalışır. Abonelikler, zamanlayıcılar gibi kaynakları temizlemek için kullanılır.'
  },
  {
    id: '3-3',
    lessonId: '3',
    question: 'Aşağıdaki useEffect kullanımlarından hangisi sadece component ilk mount olduğunda çalışır?',
    options: [
      'useEffect(() => { /* kod */ });',
      'useEffect(() => { /* kod */ }, [count]);',
      'useEffect(() => { /* kod */ }, []);',
      'useEffect(() => { /* kod */ }, null);'
    ],
    correctAnswer: 2,
    explanation: 'useEffect(() => { /* kod */ }, []); kullanımı, boş dependency array ile effect\'in sadece component ilk mount olduğunda çalışmasını sağlar. Bu, class componentlerdeki componentDidMount\'a benzer bir davranıştır.'
  },
  
  // Props ve State Arasındaki Fark
  {
    id: '4-1',
    lessonId: '4',
    question: 'Props ve state arasındaki temel fark nedir?',
    options: [
      'Props değiştirilebilir, state değiştirilemez',
      'State parent componentten gelir, props componentin kendisinde tanımlanır',
      'Props read-only\'dir, state component tarafından değiştirilebilir',
      'State sadece class componentlerde kullanılabilir, props function componentlerde'
    ],
    correctAnswer: 2,
    explanation: 'Props (properties) read-only\'dir ve parent componentten gelir. Child component props\'ları değiştiremez. State ise componentin kendi içinde yönettiği ve değiştirebildiği verilerdir.'
  },
  {
    id: '4-2',
    lessonId: '4',
    question: 'Bir child componente fonksiyon nasıl aktarılır?',
    options: [
      'State olarak tanımlanıp otomatik aktarılır',
      'Props aracılığıyla aktarılır',
      'Context API kullanılarak aktarılır',
      'Native modüller aracılığıyla aktarılır'
    ],
    correctAnswer: 1,
    explanation: 'Fonksiyonlar da diğer veriler gibi props aracılığıyla child componente aktarılabilir. Örneğin: <ChildComponent onPress={handlePress} />'
  },
  {
    id: '4-3',
    lessonId: '4',
    question: 'Aşağıdakilerden hangisi doğrudur?',
    options: [
      'State değiştiğinde component otomatik olarak yeniden render edilir',
      'Props değiştiğinde component otomatik olarak yeniden render edilir',
      'Hem props hem de state değiştiğinde component otomatik olarak yeniden render edilir',
      'Ne props ne de state değiştiğinde component otomatik olarak yeniden render edilmez'
    ],
    correctAnswer: 2,
    explanation: 'Hem props hem de state değiştiğinde component otomatik olarak yeniden render edilir. Parent component yeniden render edildiğinde, props değişmese bile child componentler de genellikle yeniden render edilir (optimize edilmemişse).'
  },
  
  // StyleSheet Kullanımı ve Stiller
  {
    id: '5-1',
    lessonId: '5',
    question: 'React Native\'de stil tanımlamak için hangi API kullanılır?',
    options: [
      'CSS',
      'SCSS',
      'StyleSheet',
      'Styled Components'
    ],
    correctAnswer: 2,
    explanation: 'React Native\'de stil tanımlamak için StyleSheet API kullanılır. StyleSheet.create() metodu ile stil nesneleri oluşturulur ve componentlere style prop\'u ile uygulanır.'
  },
  {
    id: '5-2',
    lessonId: '5',
    question: 'React Native\'de layout oluşturmak için hangi sistem kullanılır?',
    options: [
      'Grid System',
      'Flexbox',
      'CSS Grid',
      'Table Layout'
    ],
    correctAnswer: 1,
    explanation: 'React Native\'de layout oluşturmak için Flexbox kullanılır. Flexbox, elementleri farklı ekran boyutları ve düzenlerinde düzenlemek için esnek bir box modeli sağlar.'
  },
  {
    id: '5-3',
    lessonId: '5',
    question: 'Birden fazla stil nasıl uygulanır?',
    options: [
      'style={styles.style1 + styles.style2}',
      'style={[styles.style1, styles.style2]}',
      'style={styles.style1} style2={styles.style2}',
      'styles={[styles.style1, styles.style2]}'
    ],
    correctAnswer: 1,
    explanation: 'Birden fazla stil uygulamak için stil nesneleri bir array içinde birleştirilir: style={[styles.style1, styles.style2]}. Sağdaki stiller soldakileri override eder.'
  },
  
  // React Navigation ile Sayfa Geçişi
  {
    id: '6-1',
    lessonId: '6',
    question: 'Stack Navigator\'da bir sonraki ekrana geçmek için hangi fonksiyon kullanılır?',
    options: [
      'navigation.push()',
      'navigation.navigate()',
      'navigation.goTo()',
      'navigation.openScreen()'
    ],
    correctAnswer: 1,
    explanation: 'Stack Navigator\'da bir sonraki ekrana geçmek için navigation.navigate() fonksiyonu kullanılır. Örneğin: navigation.navigate("Details", { id: 1 })'
  },
  {
    id: '6-2',
    lessonId: '6',
    question: 'Bir önceki ekrana dönmek için hangi fonksiyon kullanılır?',
    options: [
      'navigation.back()',
      'navigation.return()',
      'navigation.goBack()',
      'navigation.pop()'
    ],
    correctAnswer: 2,
    explanation: 'Bir önceki ekrana dönmek için navigation.goBack() fonksiyonu kullanılır. navigation.pop() da benzer işlevi görür ancak sadece stack navigator\'da çalışır.'
  },
  {
    id: '6-3',
    lessonId: '6',
    question: 'Route parametrelerine nasıl erişilir?',
    options: [
      'navigation.params',
      'route.params',
      'props.params',
      'this.params'
    ],
    correctAnswer: 1,
    explanation: 'Route parametrelerine route.params üzerinden erişilir. Örneğin: const { id } = route.params;'
  },
  
  // FlatList ve SectionList Kullanımı
  {
    id: '7-1',
    lessonId: '7',
    question: 'FlatList\'in ScrollView\'a göre avantajı nedir?',
    options: [
      'Daha hızlı render eder',
      'Sadece ekranda görünen öğeleri render eder (lazy loading)',
      'Daha fazla özellik sunar',
      'Native scroll davranışını destekler'
    ],
    correctAnswer: 1,
    explanation: 'FlatList\'in en büyük avantajı, sadece ekranda görünen öğeleri render etmesidir (windowing). Bu, büyük listelerde performansı artırır çünkü tüm liste öğelerini aynı anda render etmek yerine, görünür olanları ve yakın çevresindekileri render eder.'
  },
  {
    id: '7-2',
    lessonId: '7',
    question: 'FlatList\'te her öğe için benzersiz bir key belirtmek neden önemlidir?',
    options: [
      'Sadece bir gereklilik, önemli değil',
      'Öğelerin doğru sırada görüntülenmesini sağlar',
      'React\'in öğeleri verimli bir şekilde güncellemesini ve yeniden render etmesini sağlar',
      'Native performansı artırır'
    ],
    correctAnswer: 2,
    explanation: 'Benzersiz key\'ler, React\'in hangi öğelerin değiştiğini, eklendiğini veya kaldırıldığını verimli bir şekilde belirlemesine yardımcı olur. Bu, gereksiz render işlemlerini önler ve performansı artırır.'
  },
  {
    id: '7-3',
    lessonId: '7',
    question: 'SectionList ne zaman kullanılmalıdır?',
    options: [
      'Her zaman, FlatList\'ten daha iyidir',
      'Sadece küçük listeler için',
      'Verileri bölümlere ayırmak istediğinizde (gruplandırma)',
      'Yatay kaydırma gerektiğinde'
    ],
    correctAnswer: 2,
    explanation: 'SectionList, verileri bölümlere (sections) ayırmak istediğinizde kullanılır. Örneğin, kişileri alfabetik olarak gruplandırmak veya ürünleri kategorilere ayırmak gibi durumlarda SectionList tercih edilir.'
  },
  
  // Context API ile Global State Yönetimi
  {
    id: '8-1',
    lessonId: '8',
    question: 'Context API ne için kullanılır?',
    options: [
      'Componentler arası iletişim için',
      'API çağrıları yapmak için',
      'Prop drilling olmadan componentler arasında veri paylaşımı için',
      'Native modüllere erişmek için'
    ],
    correctAnswer: 2,
    explanation: 'Context API, prop drilling olmadan (her seviyede props geçmeden) componentler arasında veri paylaşımı sağlar. Özellikle tema, kullanıcı bilgileri, dil tercihleri gibi global state\'leri yönetmek için kullanışlıdır.'
  },
  {
    id: '8-2',
    lessonId: '8',
    question: 'Context nasıl oluşturulur?',
    options: [
      'new Context()',
      'createContext()',
      'Context.create()',
      'makeContext()'
    ],
    correctAnswer: 1,
    explanation: 'Context, React\'in createContext() fonksiyonu ile oluşturulur. Örneğin: const MyContext = React.createContext(defaultValue);'
  },
  {
    id: '8-3',
    lessonId: '8',
    question: 'Context değerine nasıl erişilir?',
    options: [
      'useContext hook\'u ile',
      'this.context ile',
      'Context.Consumer component\'i ile',
      'A ve C seçenekleri'
    ],
    correctAnswer: 3,
    explanation: 'Context değerine erişmenin iki yolu vardır: Function componentlerde useContext hook\'u ile (const value = useContext(MyContext)) veya Context.Consumer componenti ile (<MyContext.Consumer>{value => /* render */}</MyContext.Consumer>).'
  }
];