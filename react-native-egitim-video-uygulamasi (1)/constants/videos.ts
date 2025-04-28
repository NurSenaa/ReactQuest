export interface Video {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoId: string; // YouTube video ID
}

export const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'React Native Kurulumu ve İlk Uygulama',
    description: 'Bu videoda React Native geliştirme ortamının nasıl kurulacağını ve ilk uygulamanızı nasıl oluşturacağınızı öğreneceksiniz. Expo ve React Native CLI arasındaki farkları, gerekli araçların kurulumunu ve "Hello World" uygulamasının nasıl oluşturulacağını adım adım gösteriyoruz.',
    author: 'React Native Eğitim',
    category: 'Başlangıç',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'ur6I5m2nTvk'
  },
  {
    id: '2',
    title: 'React Native Component Yapısı',
    description: 'React Native\'de component yapısını ve nasıl özel componentler oluşturacağınızı öğrenin. Fonksiyonel ve class componentler arasındaki farkları, component yaşam döngüsünü ve component kompozisyonunu detaylı olarak ele alıyoruz.',
    author: 'React Native Eğitim',
    category: 'Temel Kavramlar',
    duration: '15:20',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'sBws8MSXN7A'
  },
  {
    id: '3',
    title: 'React Native ile Stil ve Layout',
    description: 'React Native\'de stil ve layout yönetimini, flexbox kullanımını ve responsive tasarım prensiplerini öğrenin. StyleSheet API\'nin nasıl kullanılacağını, stil kalıtımını ve dinamik stillendirmeyi pratik örneklerle gösteriyoruz.',
    author: 'React Native Eğitim',
    category: 'UI ve Stil',
    duration: '18:30',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'XKgfszmI1bk'
  },
  {
    id: '4',
    title: 'React Native Navigation',
    description: 'React Navigation kütüphanesi ile ekranlar arası geçişleri ve navigasyon yapısını öğrenin. Stack, Tab ve Drawer navigasyonlarının nasıl kurulacağını, parametrelerin nasıl aktarılacağını ve navigasyon durumunun nasıl yönetileceğini kapsamlı bir şekilde ele alıyoruz.',
    author: 'React Native Eğitim',
    category: 'Navigasyon',
    duration: '22:15',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'uLHFPt9B2Os'
  },
  {
    id: '5',
    title: 'React Native ile API Entegrasyonu',
    description: 'React Native uygulamalarında API\'lerden veri çekme, işleme ve görüntüleme tekniklerini öğrenin. Fetch API ve Axios kullanımını, async/await ile asenkron işlemleri, hata yönetimini ve veri önbelleğe almayı detaylı olarak inceliyoruz.',
    author: 'React Native Eğitim',
    category: 'Veri Yönetimi',
    duration: '20:40',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'nQVCkqvU1uE'
  },
  {
    id: '6',
    title: 'React Native Animasyonlar',
    description: 'React Native\'de Animated API kullanarak çeşitli animasyonlar oluşturmayı öğrenin. Temel animasyon türlerini, paralel ve sıralı animasyonları, interpolasyonu ve gesture handler ile animasyon entegrasyonunu pratik örneklerle gösteriyoruz.',
    author: 'React Native Eğitim',
    category: 'Animasyon',
    duration: '16:55',
    thumbnail: 'https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'TQMrJ1WnEh4'
  },
  {
    id: '7',
    title: 'React Native ile Form Yönetimi',
    description: 'React Native uygulamalarında form oluşturma, validasyon ve veri gönderme işlemlerini öğrenin. Formik ve Yup kütüphanelerinin kullanımını, form durumunun yönetimini, hata mesajlarını ve form gönderimini kapsamlı bir şekilde ele alıyoruz.',
    author: 'React Native Eğitim',
    category: 'Form Yönetimi',
    duration: '19:10',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'ur6I5m2nTvk'
  },
  {
    id: '8',
    title: 'React Native ile Yerel Depolama',
    description: 'AsyncStorage ve diğer yerel depolama yöntemlerini kullanarak veri saklama ve yönetme tekniklerini öğrenin. Basit veri saklama, kompleks objelerin depolanması, şifrelenmiş depolama ve depolama stratejilerini pratik örneklerle gösteriyoruz.',
    author: 'React Native Eğitim',
    category: 'Veri Yönetimi',
    duration: '14:30',
    thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'sBws8MSXN7A'
  },
  {
    id: '9',
    title: 'React Native ile State Yönetimi',
    description: 'React Native uygulamalarında global state yönetimi için Redux, Context API ve MobX gibi çözümleri öğrenin. State yönetim kütüphanelerinin kurulumunu, store yapılandırmasını ve componentler arası veri paylaşımını detaylı olarak inceliyoruz.',
    author: 'React Native Eğitim',
    category: 'State Yönetimi',
    duration: '23:15',
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'XKgfszmI1bk'
  },
  {
    id: '10',
    title: 'React Native ile Native Modüller',
    description: 'React Native uygulamalarında native modüller oluşturmayı ve JavaScript ile native kod arasında köprü kurmayı öğrenin. iOS ve Android için native modül yazımını, event emitter kullanımını ve native performans optimizasyonlarını kapsamlı bir şekilde ele alıyoruz.',
    author: 'React Native Eğitim',
    category: 'Native Entegrasyon',
    duration: '25:40',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'nQVCkqvU1uE'
  },
  {
    id: '11',
    title: 'React Native Performans Optimizasyonu',
    description: 'React Native uygulamalarında performans sorunlarını tespit etme ve çözme tekniklerini öğrenin. Render optimizasyonu, memo kullanımı, liste performansı, bellek yönetimi ve native driver animasyonlarını pratik örneklerle gösteriyoruz.',
    author: 'React Native Eğitim',
    category: 'Performans',
    duration: '21:30',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'TQMrJ1WnEh4'
  },
  {
    id: '12',
    title: 'React Native ile Tema ve Görünüm Yönetimi',
    description: 'React Native uygulamalarında tema sistemi oluşturmayı ve koyu/açık mod desteği eklemeyi öğrenin. Tema provider yapısını, dinamik stil yönetimini, sistem temasına uyum sağlamayı ve tema geçişlerini detaylı olarak inceliyoruz.',
    author: 'React Native Eğitim',
    category: 'UI ve Stil',
    duration: '17:45',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    videoId: 'uLHFPt9B2Os'
  }
];