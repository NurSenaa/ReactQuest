export interface ReactConcept {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  practiceSection?: string;
  category: string;
  videoId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const PROGRESS_STORAGE_KEY = 'user_progress';

export const CATEGORIES: Category[] = [
  {
    id: 'basics',
    name: 'Temel Kavramlar',
    icon: 'Layers'
  },
  {
    id: 'state',
    name: 'State Yönetimi',
    icon: 'ToggleLeft'
  },
  {
    id: 'ui',
    name: 'UI ve Stil',
    icon: 'Palette'
  },
  {
    id: 'navigation',
    name: 'Navigasyon',
    icon: 'Navigation'
  }
];

export const REACT_CONCEPTS: ReactConcept[] = [
  {
    id: '1',
    title: 'React Native Nedir?',
    content: 'React Native, Facebook tarafından geliştirilen açık kaynaklı bir mobil uygulama geliştirme framework\'üdür. JavaScript ve React kullanarak iOS ve Android platformları için native mobil uygulamalar geliştirmenizi sağlar.',
    category: 'basics',
    videoId: 'ur6I5m2nTvk', // React Native Introduction
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Komponentler ve JSX',
    content: 'React Native\'de her şey bir komponenttir. Komponentler, uygulamanızın UI\'ını oluşturan yapı taşlarıdır. JSX, JavaScript içinde HTML benzeri bir sözdizimi kullanmanıza olanak tanır.',
    codeExample: `import React from 'react';
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Merhaba, React Native!</Text>
    </View>
  );
}`,
    category: 'basics',
    videoId: 'sBws8MSXN7A', // Components and JSX
    difficulty: 'beginner'
  },
  {
    id: '3',
    title: 'Props ve State',
    content: 'Props, komponentler arası veri aktarımı için kullanılır. State ise komponentin kendi içinde tuttuğu ve değişebilen verilerdir.',
    codeExample: `import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

// Props örneği
function Greeting(props) {
  return <Text>Merhaba, {props.name}!</Text>;
}

// State örneği
export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Greeting name="Kullanıcı" />
      <Text>Sayaç: {count}</Text>
      <Button title="Artır" onPress={() => setCount(count + 1)} />
    </View>
  );
}`,
    category: 'state',
    videoId: 'XKgfszmI1bk', // Props and State
    difficulty: 'beginner'
  },
  {
    id: '4',
    title: 'Temel Komponentler',
    content: 'React Native, View, Text, Image, ScrollView, TextInput gibi temel komponentler sunar. Bunlar, uygulamanızın kullanıcı arayüzünü oluşturmak için kullanılır.',
    codeExample: `import React from 'react';
import { View, Text, Image, ScrollView, TextInput } from 'react-native';

export default function BasicComponents() {
  return (
    <ScrollView>
      <View style={{ padding: 10 }}>
        <Text>Bu bir metin komponentidir.</Text>
        <Image 
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
          style={{ width: 50, height: 50 }} 
        />
        <TextInput 
          placeholder="Buraya yazın..." 
          style={{ borderWidth: 1, padding: 10 }} 
        />
      </View>
    </ScrollView>
  );
}`,
    category: 'basics',
    videoId: 'uLHFPt9B2Os', // Basic Components
    difficulty: 'beginner'
  },
  {
    id: '5',
    title: 'Stil ve Layout',
    content: 'React Native\'de stil, CSS\'e benzer bir şekilde JavaScript nesneleri kullanılarak uygulanır. Flexbox, komponentlerin düzenini kontrol etmek için kullanılır.',
    codeExample: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StyleExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Başlık</Text>
      <Text style={styles.subtitle}>Alt başlık</Text>
      
      <View style={styles.flexContainer}>
        <View style={[styles.box, { backgroundColor: 'red' }]} />
        <View style={[styles.box, { backgroundColor: 'green' }]} />
        <View style={[styles.box, { backgroundColor: 'blue' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    width: 50,
    height: 50,
  },
});`,
    category: 'ui',
    videoId: 'nQVCkqvU1uE', // Styling and Layout
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'Hooks Kullanımı',
    content: 'Hooks, fonksiyonel komponentlerde state ve diğer React özelliklerini kullanmanızı sağlayan fonksiyonlardır. useState, useEffect, useContext gibi built-in hook\'lar vardır.',
    codeExample: `import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function HooksExample() {
  // useState hook'u
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // useEffect hook'u
  useEffect(() => {
    // Komponent mount edildiğinde çalışır
    console.log('Komponent mount edildi');
    
    // Simüle edilmiş bir API çağrısı
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    // Cleanup fonksiyonu (komponent unmount edildiğinde çalışır)
    return () => {
      console.log('Komponent unmount edildi');
    };
  }, []); // Boş dependency array, sadece mount ve unmount'ta çalışmasını sağlar
  
  // count değiştiğinde çalışacak useEffect
  useEffect(() => {
    console.log('Count değişti:', count);
  }, [count]);
  
  return (
    <View style={{ padding: 20 }}>
      {loading ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <>
          <Text>Sayaç: {count}</Text>
          <Button title="Artır" onPress={() => setCount(count + 1)} />
        </>
      )}
    </View>
  );
}`,
    category: 'state',
    videoId: 'TQMrJ1WnEh4', // Hooks Usage
    difficulty: 'intermediate'
  },
  {
    id: '7',
    title: 'React Navigation',
    content: 'React Navigation, React Native uygulamalarında ekranlar arası geçiş yapmanızı sağlayan popüler bir kütüphanedir. Stack, Tab, Drawer gibi farklı navigasyon tipleri sunar.',
    codeExample: `import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Ana ekran komponenti
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Ana Ekran</Text>
      <Button
        title="Detay Ekranına Git"
        onPress={() => navigation.navigate('Details', { itemId: 86 })}
      />
    </View>
  );
}

// Detay ekranı komponenti
function DetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Detay Ekranı</Text>
      <Text>Item ID: {itemId}</Text>
      <Button
        title="Geri Dön"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Ana Sayfa' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{ title: 'Detaylar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
    category: 'navigation',
    videoId: 'uLHFPt9B2Os', // React Navigation
    difficulty: 'intermediate'
  },
  {
    id: '8',
    title: 'API İstekleri ve Veri Yönetimi',
    content: 'React Native uygulamalarında, fetch veya axios gibi kütüphaneler kullanarak API istekleri yapabilirsiniz. Alınan verileri state\'de saklayabilir ve UI\'da gösterebilirsiniz.',
    codeExample: `import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function ApiExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      setError('Veri yüklenirken bir hata oluştu');
      setLoading(false);
      console.error(error);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Verileri</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemBody: {
    fontSize: 14,
    color: '#666',
  },
});`,
    category: 'state',
    videoId: 'sBws8MSXN7A', // API Requests and Data Management
    difficulty: 'intermediate'
  },
  {
    id: '9',
    title: 'Animasyonlar ve Geçişler',
    content: 'React Native, kullanıcı deneyimini geliştirmek için çeşitli animasyon API\'leri sunar. Animated API, LayoutAnimation ve React Native Reanimated gibi seçenekler mevcuttur.',
    codeExample: `import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

export default function AnimationExample() {
  // Animated değeri oluştur
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  
  // Fade in animasyonu
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  
  // Fade out animasyonu
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  
  // Hareket animasyonu
  const startMoving = () => {
    Animated.timing(moveAnim, {
      toValue: 200,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Animasyon tamamlandığında başa dön
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  };
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          {
            opacity: fadeAnim,
            transform: [{ translateX: moveAnim }],
          },
        ]}
      >
        <Text style={styles.text}>Animasyon Örneği</Text>
      </Animated.View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fadeIn}>
          <Text style={styles.buttonText}>Fade In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={fadeOut}>
          <Text style={styles.buttonText}>Fade Out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={startMoving}>
          <Text style={styles.buttonText}>Hareket Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: 'tomato',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#4287f5',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});`,
    category: 'ui',
    videoId: 'TQMrJ1WnEh4', // Animations and Transitions
    difficulty: 'intermediate'
  },
  {
    id: '10',
    title: 'Performans Optimizasyonu',
    content: 'React Native uygulamalarında performans, kullanıcı deneyimi için kritik öneme sahiptir. memo, useCallback, useMemo gibi React özellikleri ve FlatList, VirtualizedList gibi performans odaklı komponentler kullanarak uygulamanızı optimize edebilirsiniz.',
    codeExample: `import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

// Memo ile optimize edilmiş bir alt komponent
const Item = React.memo(({ title, onPress }) => {
  console.log('Item rendered:', title);
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Button title="Seç" onPress={() => onPress(title)} />
    </View>
  );
});

export default function OptimizationExample() {
  const [items, setItems] = useState(Array.from({ length: 100 }, (_, i) => ({
    id: i.toString(),
    title: \`Öğe \${i + 1}\`,
  })));
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [count, setCount] = useState(0);
  
  // useCallback ile fonksiyon referansını sabitliyoruz
  const handleItemPress = useCallback((title) => {
    setSelectedItem(title);
  }, []);
  
  // useMemo ile hesaplama sonucunu önbelleğe alıyoruz
  const expensiveCalculation = useMemo(() => {
    console.log('Expensive calculation running...');
    return items.reduce((total, item) => total + item.id.length, 0);
  }, [items]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performans Optimizasyonu</Text>
      
      <Text style={styles.info}>
        Seçilen Öğe: {selectedItem || 'Yok'}
      </Text>
      
      <Text style={styles.info}>
        Hesaplama Sonucu: {expensiveCalculation}
      </Text>
      
      <Text style={styles.info}>
        Sayaç: {count}
      </Text>
      
      <Button 
        title="Sayacı Artır" 
        onPress={() => setCount(count + 1)} 
        style={styles.button}
      />
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item title={item.title} onPress={handleItemPress} />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginVertical: 16,
  },
  list: {
    marginTop: 16,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
  },
});`,
    category: 'basics',
    videoId: 'nQVCkqvU1uE', // Performance Optimization
    difficulty: 'advanced'
  }
];