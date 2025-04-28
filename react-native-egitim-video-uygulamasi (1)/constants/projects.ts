export interface ProjectChallenge {
  description: string;
  hint?: string;
  starterCode: string;
  solutionCode?: string;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  codeExample?: string;
  challenge?: ProjectChallenge;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  category: string;
  estimatedHours?: number;
  learningGoals: string[];
  steps: ProjectStep[];
}

export const PROJECT_PROGRESS_KEY = 'project_progress';

export const PROJECTS: Project[] = [
  {
    id: 'todo-app',
    title: 'To-Do List Uygulaması',
    description: 'Temel React Native bileşenlerini kullanarak basit bir görev yönetim uygulaması oluşturun. State yönetimi, form işleme ve liste görüntüleme becerilerinizi geliştirin.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
    difficulty: 'Kolay',
    category: 'Temel Uygulamalar',
    estimatedHours: 3,
    learningGoals: [
      'React Native temel bileşenlerini kullanma',
      'State yönetimi ve useState hook kullanımı',
      'Form işleme ve kullanıcı girdisi alma',
      'Liste görüntüleme ve FlatList kullanımı',
      'AsyncStorage ile veri kalıcılığı sağlama'
    ],
    steps: [
      {
        id: 'todo-1',
        title: 'Proje Kurulumu ve Temel Bileşenler',
        description: 'Bu adımda, To-Do List uygulamasının temel yapısını oluşturacağız. Ana ekran tasarımını yapacak ve gerekli bileşenleri tanımlayacağız.',
        instructions: [
          'Uygulamanın ana ekranını oluşturun ve başlık ekleyin.',
          'Görev ekleme formu için bir TextInput ve Button bileşeni ekleyin.',
          'Görevleri listelemek için bir FlatList bileşeni ekleyin.',
          'Temel stillendirmeleri yapın.'
        ],
        codeExample: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A6FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#4A6FFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
});`,
        challenge: {
          description: 'Yukarıdaki kodu temel alarak, uygulamanın ana ekranını oluşturun. Görev ekleme formunu ve görev listesini içeren bir ekran tasarlayın.',
          hint: 'TextInput, Button ve FlatList bileşenlerini kullanın. Şimdilik görev ekleme işlevselliği eklemenize gerek yok, sadece arayüzü oluşturun.',
          starterCode: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';

export default function TodoApp() {
  // Görevleri tutacak state'i tanımlayın
  
  // Görev metni için state tanımlayın
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header bölümünü oluşturun */}
      
      {/* Görev ekleme formunu oluşturun */}
      
      {/* Görev listesini oluşturun */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});`
        }
      },
      {
        id: 'todo-2',
        title: 'Görev Ekleme İşlevselliği',
        description: 'Bu adımda, kullanıcının yeni görevler ekleyebilmesi için gerekli işlevselliği ekleyeceğiz.',
        instructions: [
          'Görev ekleme fonksiyonunu oluşturun.',
          'TextInput ve Button bileşenlerini bu fonksiyona bağlayın.',
          'Yeni görevlere benzersiz ID atayın.',
          'Boş görev eklenmesini engelleyin.',
          'Görev ekledikten sonra input alanını temizleyin.'
        ],
        codeExample: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert 
} from 'react-native';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Hata', 'Boş görev eklenemez!');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setTaskText(''); // Input alanını temizle
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Önceki stiller aynı
});`,
        challenge: {
          description: 'Görev ekleme işlevselliğini uygulamaya ekleyin. Kullanıcı metin girdikten sonra "Ekle" butonuna bastığında yeni bir görev oluşturulmalı ve listeye eklenmelidir.',
          hint: 'addTask fonksiyonu oluşturun ve bu fonksiyonu "Ekle" butonuna bağlayın. Her görev için benzersiz bir ID oluşturmak için Date.now() kullanabilirsiniz.',
          starterCode: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert 
} from 'react-native';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  // Görev ekleme fonksiyonunu oluşturun
  const addTask = () => {
    // Boş görev kontrolü yapın
    
    // Yeni görev oluşturun
    
    // Görevi listeye ekleyin
    
    // Input alanını temizleyin
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A6FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#4A6FFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
});`
        }
      },
      {
        id: 'todo-3',
        title: 'Görev Tamamlama ve Silme',
        description: 'Bu adımda, kullanıcının görevleri tamamlanmış olarak işaretleyebilmesi ve silebilmesi için gerekli işlevselliği ekleyeceğiz.',
        instructions: [
          'Görev tamamlama fonksiyonunu oluşturun.',
          'Görev silme fonksiyonunu oluşturun.',
          'Görev öğelerine tamamlama ve silme butonları ekleyin.',
          'Tamamlanan görevleri görsel olarak farklı gösterin (örn. üstü çizili metin).'
        ],
        codeExample: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { CheckCircle, Circle, Trash2 } from 'lucide-react-native';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Hata', 'Boş görev eklenemez!');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(item.id)}
              style={styles.taskCheckbox}
            >
              {item.completed ? (
                <CheckCircle size={24} color="#4A6FFF" />
              ) : (
                <Circle size={24} color="#4A6FFF" />
              )}
            </TouchableOpacity>
            
            <Text 
              style={[
                styles.taskText,
                item.completed && styles.completedTaskText
              ]}
            >
              {item.text}
            </Text>
            
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Trash2 size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Önceki stiller aynı
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    padding: 4,
  },
});`,
        challenge: {
          description: 'Görev tamamlama ve silme işlevselliğini uygulamaya ekleyin. Kullanıcı bir göreve tıkladığında tamamlanmış olarak işaretlenmeli, silme butonuna tıkladığında ise görev silinmelidir.',
          hint: 'toggleTaskCompletion ve deleteTask fonksiyonlarını oluşturun. Tamamlanan görevleri görsel olarak farklı göstermek için koşullu stil kullanın.',
          starterCode: `import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { CheckCircle, Circle, Trash2 } from 'lucide-react-native';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Hata', 'Boş görev eklenemez!');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  // Görev tamamlama fonksiyonunu oluşturun
  const toggleTaskCompletion = (id) => {
    // Görevin tamamlanma durumunu değiştirin
  };

  // Görev silme fonksiyonunu oluşturun
  const deleteTask = (id) => {
    // Görevi listeden kaldırın
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {/* Görev tamamlama butonu ekleyin */}
            
            {/* Görev metni ekleyin (tamamlanmışsa farklı stil uygulayın) */}
            
            {/* Görev silme butonu ekleyin */}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A6FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#4A6FFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  // Diğer stilleri ekleyin
});`
        }
      },
      {
        id: 'todo-4',
        title: 'AsyncStorage ile Veri Kalıcılığı',
        description: 'Bu adımda, uygulamanın verilerini AsyncStorage kullanarak cihazda kalıcı olarak saklayacağız. Böylece kullanıcı uygulamayı kapatıp açtığında görevleri kaybolmayacak.',
        instructions: [
          'AsyncStorage\'ı projeye ekleyin.',
          'Görevleri AsyncStorage\'a kaydetmek için fonksiyon oluşturun.',
          'Görevleri AsyncStorage\'dan yüklemek için fonksiyon oluşturun.',
          'useEffect hook\'u ile uygulama başladığında görevleri yükleyin.',
          'Görevler değiştiğinde AsyncStorage\'a kaydedin.'
        ],
        codeExample: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { CheckCircle, Circle, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = 'todo_tasks';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [loading, setLoading] = useState(true);

  // Görevleri AsyncStorage'dan yükleme
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
        Alert.alert('Hata', 'Görevler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  // Görevleri AsyncStorage'a kaydetme
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
        Alert.alert('Hata', 'Görevler kaydedilirken bir hata oluştu.');
      }
    };
    
    // İlk yükleme sırasında kaydetmeyi atla
    if (!loading) {
      saveTasks();
    }
  }, [tasks, loading]);

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Hata', 'Boş görev eklenemez!');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <TouchableOpacity
                onPress={() => toggleTaskCompletion(item.id)}
                style={styles.taskCheckbox}
              >
                {item.completed ? (
                  <CheckCircle size={24} color="#4A6FFF" />
                ) : (
                  <Circle size={24} color="#4A6FFF" />
                )}
              </TouchableOpacity>
              
              <Text 
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText
                ]}
              >
                {item.text}
              </Text>
              
              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
              >
                <Trash2 size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Önceki stiller aynı
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
});`,
        challenge: {
          description: 'AsyncStorage kullanarak görevleri cihazda kalıcı olarak saklayın. Uygulama başladığında görevler yüklenmeli ve görevler değiştiğinde kaydedilmelidir.',
          hint: 'useEffect hook\'unu iki kez kullanın: biri görevleri yüklemek için, diğeri görevler değiştiğinde kaydetmek için. AsyncStorage\'ın asenkron olduğunu unutmayın.',
          starterCode: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { CheckCircle, Circle, Trash2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = 'todo_tasks';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [loading, setLoading] = useState(true);

  // Görevleri AsyncStorage'dan yükleme
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // AsyncStorage'dan görevleri yükleyin
        
      } catch (error) {
        console.error('Failed to load tasks:', error);
        Alert.alert('Hata', 'Görevler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  // Görevleri AsyncStorage'a kaydetme
  useEffect(() => {
    const saveTasks = async () => {
      try {
        // Görevleri AsyncStorage'a kaydedin
        
      } catch (error) {
        console.error('Failed to save tasks:', error);
        Alert.alert('Hata', 'Görevler kaydedilirken bir hata oluştu.');
      }
    };
    
    // İlk yükleme sırasında kaydetmeyi atla
    if (!loading) {
      saveTasks();
    }
  }, [tasks, loading]);

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Hata', 'Boş görev eklenemez!');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yapılacaklar Listesi</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <TouchableOpacity
                onPress={() => toggleTaskCompletion(item.id)}
                style={styles.taskCheckbox}
              >
                {item.completed ? (
                  <CheckCircle size={24} color="#4A6FFF" />
                ) : (
                  <Circle size={24} color="#4A6FFF" />
                )}
              </TouchableOpacity>
              
              <Text 
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText
                ]}
              >
                {item.text}
              </Text>
              
              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
              >
                <Trash2 size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A6FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#4A6FFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
});`
        }
      }
    ]
  },
  {
    id: 'weather-app',
    title: 'Hava Durumu Uygulaması',
    description: 'API entegrasyonu, veri getirme ve görselleştirme becerilerinizi geliştirin. Konum tabanlı hava durumu bilgilerini gösteren bir uygulama oluşturun.',
    image: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
    difficulty: 'Orta',
    category: 'API Entegrasyonu',
    estimatedHours: 5,
    learningGoals: [
      'API\'lardan veri çekme ve işleme',
      'Asenkron işlemleri yönetme',
      'Konum servislerini kullanma',
      'Veri görselleştirme ve UI tasarımı',
      'Hata yönetimi ve yükleme durumları'
    ],
    steps: [
      {
        id: 'weather-1',
        title: 'Proje Kurulumu ve API Bağlantısı',
        description: 'Bu adımda, hava durumu uygulamasının temel yapısını oluşturacak ve OpenWeatherMap API\'sine bağlanacağız.',
        instructions: [
          'OpenWeatherMap API\'den ücretsiz bir API anahtarı alın (https://openweathermap.org/api).',
          'API anahtarını güvenli bir şekilde saklayın.',
          'API\'ye istek atmak için fetch veya axios kullanın.',
          'Temel hava durumu verilerini çekin ve konsola yazdırın.'
        ],
        codeExample: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';

// API anahtarınızı buraya ekleyin
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Örnek olarak İstanbul için hava durumu verileri
      const response = await fetch(
        \`\${BASE_URL}/weather?q=Istanbul&units=metric&appid=\${API_KEY}\`
      );
      
      if (!response.ok) {
        throw new Error('Hava durumu verileri alınamadı');
      }
      
      const data = await response.json();
      console.log('Weather data:', data);
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6FFF" />
          <Text style={styles.loadingText}>Hava durumu yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherContainer}>
        <Text style={styles.cityName}>{weatherData?.name}</Text>
        <Text style={styles.temperature}>
          {Math.round(weatherData?.main?.temp)}°C
        </Text>
        <Text style={styles.weatherDescription}>
          {weatherData?.weather[0]?.description}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '200',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
  },
});`,
        challenge: {
          description: 'OpenWeatherMap API\'ye bağlanarak temel hava durumu verilerini çekin. İstanbul için hava durumu bilgilerini görüntüleyin.',
          hint: 'API anahtarınızı güvenli bir şekilde saklayın. fetch veya axios kullanarak API\'ye istek atın. Yükleme durumu ve hata yönetimi için state kullanın.',
          starterCode: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';

// API anahtarınızı buraya ekleyin
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default function WeatherApp() {
  // State'leri tanımlayın (weatherData, loading, error)
  
  // useEffect ile uygulama başladığında hava durumu verilerini çekin
  
  // Hava durumu verilerini çekmek için bir fonksiyon oluşturun
  const fetchWeatherData = async () => {
    try {
      // Yükleme durumunu ve hata durumunu ayarlayın
      
      // API'ye istek atın
      
      // Yanıtı kontrol edin
      
      // Verileri state'e kaydedin
    } catch (err) {
      // Hata durumunu yönetin
    } finally {
      // Yükleme durumunu güncelleyin
    }
  };

  // Yükleme durumu için UI
  if (loading) {
    return (
      // Yükleme ekranını gösterin
    );
  }

  // Hata durumu için UI
  if (error) {
    return (
      // Hata ekranını gösterin
    );
  }

  // Hava durumu verilerini gösteren UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherContainer}>
        {/* Şehir adını gösterin */}
        
        {/* Sıcaklığı gösterin */}
        
        {/* Hava durumu açıklamasını gösterin */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '200',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
  },
});`
        }
      },
      {
        id: 'weather-2',
        title: 'Konum Tabanlı Hava Durumu',
        description: 'Bu adımda, kullanıcının mevcut konumunu alarak o konuma ait hava durumu verilerini göstereceğiz.',
        instructions: [
          'Expo Location API\'sini kullanarak kullanıcının konumunu alın.',
          'Konum izinlerini kontrol edin ve gerekirse isteyin.',
          'Alınan konum bilgilerini kullanarak hava durumu verilerini çekin.',
          'Konum alınamadığında varsayılan bir şehir için hava durumu gösterin.'
        ],
        codeExample: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import * as Location from 'expo-location';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Konum izinlerini kontrol et
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // İzin verilmediyse varsayılan şehir için hava durumu göster
        console.log('Location permission denied, using default city');
        fetchWeatherByCity('Istanbul');
        return;
      }
      
      // Kullanıcının konumunu al
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      
      // Konum bilgilerini kullanarak hava durumu verilerini çek
      fetchWeatherByCoords(
        locationData.coords.latitude,
        locationData.coords.longitude
      );
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Konum alınamadı. Varsayılan şehir için hava durumu gösteriliyor.');
      fetchWeatherByCity('Istanbul');
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        \`\${BASE_URL}/weather?lat=\${latitude}&lon=\${longitude}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!response.ok) {
        throw new Error('Hava durumu verileri alınamadı');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await fetch(
        \`\${BASE_URL}/weather?q=\${city}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!response.ok) {
        throw new Error('Hava durumu verileri alınamadı');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6FFF" />
          <Text style={styles.loadingText}>Konum ve hava durumu yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherContainer}>
        <Text style={styles.cityName}>{weatherData?.name}</Text>
        <Text style={styles.temperature}>
          {Math.round(weatherData?.main?.temp)}°C
        </Text>
        <Text style={styles.weatherDescription}>
          {weatherData?.weather[0]?.description}
        </Text>
        
        {location && (
          <Text style={styles.locationText}>
            Konumunuz: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Önceki stiller aynı
  locationText: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
  },
});`,
        challenge: {
          description: 'Kullanıcının mevcut konumunu alarak o konuma ait hava durumu verilerini gösterin. Konum izinlerini kontrol edin ve gerekirse isteyin.',
          hint: 'Expo Location API\'sini kullanarak kullanıcının konumunu alın. Konum izinlerini kontrol edin ve izin verilmediyse varsayılan bir şehir için hava durumu gösterin.',
          starterCode: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import * as Location from 'expo-location';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      // Yükleme durumunu ve hata durumunu ayarlayın
      
      // Konum izinlerini kontrol edin
      
      // İzin verilmediyse varsayılan şehir için hava durumu gösterin
      
      // Kullanıcının konumunu alın
      
      // Konum bilgilerini kullanarak hava durumu verilerini çekin
    } catch (err) {
      // Hata durumunu yönetin ve varsayılan şehir için hava durumu gösterin
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    try {
      // Koordinatlara göre hava durumu verilerini çekin
      
    } catch (err) {
      // Hata durumunu yönetin
    } finally {
      // Yükleme durumunu güncelleyin
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      // Şehir adına göre hava durumu verilerini çekin
      
    } catch (err) {
      // Hata durumunu yönetin
    } finally {
      // Yükleme durumunu güncelleyin
    }
  };

  if (loading) {
    return (
      // Yükleme ekranını gösterin
    );
  }

  if (error) {
    return (
      // Hata ekranını gösterin
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherContainer}>
        {/* Şehir adını gösterin */}
        
        {/* Sıcaklığı gösterin */}
        
        {/* Hava durumu açıklamasını gösterin */}
        
        {/* Konum bilgilerini gösterin */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '200',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
  },
  locationText: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
  },
});`
        }
      },
      {
        id: 'weather-3',
        title: 'Hava Durumu Detayları ve UI Geliştirme',
        description: 'Bu adımda, hava durumu verilerini daha detaylı gösterecek ve kullanıcı arayüzünü geliştirecek şekilde uygulamamızı geliştireceğiz.',
        instructions: [
          'Sıcaklık, nem, rüzgar hızı gibi ek hava durumu detaylarını gösterin.',
          'Hava durumu ikonları ekleyin.',
          'Arka plan rengini veya görselini hava durumuna göre değiştirin.',
          'Kullanıcı arayüzünü daha çekici hale getirin.'
        ],
        codeExample: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView,
  Image,
  ImageBackground,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Hava durumu kodlarına göre arka plan resimleri
const weatherBackgrounds = {
  Clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  Rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  Snow: 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Mist: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
  default: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
};

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission denied, using default city');
        fetchWeatherByCity('Istanbul');
        return;
      }
      
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      
      fetchWeatherByCoords(
        locationData.coords.latitude,
        locationData.coords.longitude
      );
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Konum alınamadı. Varsayılan şehir için hava durumu gösteriliyor.');
      fetchWeatherByCity('Istanbul');
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        \`\${BASE_URL}/weather?lat=\${latitude}&lon=\${longitude}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!response.ok) {
        throw new Error('Hava durumu verileri alınamadı');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await fetch(
        \`\${BASE_URL}/weather?q=\${city}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!response.ok) {
        throw new Error('Hava durumu verileri alınamadı');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hava durumu ikonunu al
  const getWeatherIcon = (iconCode) => {
    return \`http://openweathermap.org/img/wn/\${iconCode}@2x.png\`;
  };

  // Hava durumuna göre arka plan resmini al
  const getBackgroundImage = () => {
    if (!weatherData) return weatherBackgrounds.default;
    
    const weatherMain = weatherData.weather[0].main;
    return weatherBackgrounds[weatherMain] || weatherBackgrounds.default;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6FFF" />
          <Text style={styles.loadingText}>Konum ve hava durumu yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: getBackgroundImage() }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.weatherContainer}>
            <Text style={styles.cityName}>{weatherData?.name}</Text>
            
            <View style={styles.tempContainer}>
              <Text style={styles.temperature}>
                {Math.round(weatherData?.main?.temp)}°C
              </Text>
              {weatherData?.weather[0]?.icon && (
                <Image
                  source={{ uri: getWeatherIcon(weatherData.weather[0].icon) }}
                  style={styles.weatherIcon}
                />
              )}
            </View>
            
            <Text style={styles.weatherDescription}>
              {weatherData?.weather[0]?.description}
            </Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Feather name="droplet" size={22} color="white" />
                <Text style={styles.detailText}>
                  {weatherData?.main?.humidity}%
                </Text>
                <Text style={styles.detailLabel}>Nem</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Feather name="wind" size={22} color="white" />
                <Text style={styles.detailText}>
                  {Math.round(weatherData?.wind?.speed * 3.6)} km/s
                </Text>
                <Text style={styles.detailLabel}>Rüzgar</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Feather name="thermometer" size={22} color="white" />
                <Text style={styles.detailText}>
                  {Math.round(weatherData?.main?.feels_like)}°C
                </Text>
                <Text style={styles.detailLabel}>Hissedilen</Text>
              </View>
            </View>
            
            <View style={styles.minMaxContainer}>
              <Text style={styles.minMaxText}>
                Min: {Math.round(weatherData?.main?.temp_min)}°C
              </Text>
              <Text style={styles.minMaxText}>
                Max: {Math.round(weatherData?.main?.temp_max)}°C
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '200',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  weatherDescription: {
    fontSize: 24,
    color: 'white',
    textTransform: 'capitalize',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  detailLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  minMaxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});`,
        challenge: {
          description: 'Hava durumu verilerini daha detaylı gösterin ve kullanıcı arayüzünü geliştirin. Sıcaklık, nem, rüzgar hızı gibi ek detayları ekleyin ve hava durumuna göre arka plan değiştirin.',
          hint: 'OpenWeatherMap API\'den gelen verileri kullanarak nem, rüzgar hızı, hissedilen sıcaklık gibi detayları gösterin. Hava durumu ikonları için API\'nin sağladığı URL\'leri kullanın. Arka plan için hava durumu koduna göre farklı resimler kullanın.',
          starterCode: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView,
  Image,
  ImageBackground,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Hava durumu kodlarına göre arka plan resimleri
const weatherBackgrounds = {
  Clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  Rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  Snow: 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Mist: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
  default: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
};

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  // Önceki fonksiyonlar aynı (getLocationAndWeather, fetchWeatherByCoords, fetchWeatherByCity)
  
  // Hava durumu ikonunu al
  const getWeatherIcon = (iconCode) => {
    // OpenWeatherMap ikon URL'sini döndürün
  };

  // Hava durumuna göre arka plan resmini al
  const getBackgroundImage = () => {
    // Hava durumuna göre arka plan resmini döndürün
  };

  if (loading) {
    return (
      // Yükleme ekranını gösterin
    );
  }

  if (error) {
    return (
      // Hata ekranını gösterin
    );
  }

  return (
    <ImageBackground
      source={{ uri: getBackgroundImage() }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.weatherContainer}>
            {/* Şehir adını gösterin */}
            
            {/* Sıcaklık ve hava durumu ikonunu gösterin */}
            
            {/* Hava durumu açıklamasını gösterin */}
            
            {/* Detayları gösterin (nem, rüzgar, hissedilen sıcaklık) */}
            
            {/* Minimum ve maksimum sıcaklıkları gösterin */}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});`
        }
      },
      {
        id: 'weather-4',
        title: '5 Günlük Tahmin ve Şehir Arama',
        description: 'Bu adımda, 5 günlük hava durumu tahminini gösterecek ve kullanıcının farklı şehirler için hava durumu araması yapabilmesini sağlayacağız.',
        instructions: [
          '5 günlük hava durumu tahmini için API çağrısı yapın.',
          'Günlük tahminleri bir liste veya kart şeklinde gösterin.',
          'Şehir arama özelliği için bir arama çubuğu ekleyin.',
          'Arama sonuçlarına göre hava durumu verilerini güncelleyin.'
        ],
        codeExample: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import { Feather, Ionicons } from '@expo/vector-icons';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Hava durumu kodlarına göre arka plan resimleri
const weatherBackgrounds = {
  // Önceki tanımlamalar aynı
};

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission denied, using default city');
        fetchWeatherAndForecastByCity('Istanbul');
        return;
      }
      
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      
      fetchWeatherAndForecastByCoords(
        locationData.coords.latitude,
        locationData.coords.longitude
      );
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Konum alınamadı. Varsayılan şehir için hava durumu gösteriliyor.');
      fetchWeatherAndForecastByCity('Istanbul');
    }
  };

  const fetchWeatherAndForecastByCoords = async (latitude, longitude) => {
    try {
      // Mevcut hava durumu
      const weatherResponse = await fetch(
        \`\${BASE_URL}/weather?lat=\${latitude}&lon=\${longitude}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Hava durumu verileri alınamadı');
      }
      
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      
      // 5 günlük tahmin
      const forecastResponse = await fetch(
        \`\${BASE_URL}/forecast?lat=\${latitude}&lon=\${longitude}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Tahmin verileri alınamadı');
      }
      
      const forecastData = await forecastResponse.json();
      
      // Günlük tahminleri grupla (her gün için bir tahmin)
      const dailyForecasts = groupForecastsByDay(forecastData.list);
      setForecastData(dailyForecasts);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherAndForecastByCity = async (city) => {
    try {
      // Mevcut hava durumu
      const weatherResponse = await fetch(
        \`\${BASE_URL}/weather?q=\${city}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(\`\${city} için hava durumu verileri alınamadı\`);
      }
      
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      
      // 5 günlük tahmin
      const forecastResponse = await fetch(
        \`\${BASE_URL}/forecast?q=\${city}&units=metric&appid=\${API_KEY}\`
      );
      
      if (!forecastResponse.ok) {
        throw new Error(\`\${city} için tahmin verileri alınamadı\`);
      }
      
      const forecastData = await forecastResponse.json();
      
      // Günlük tahminleri grupla (her gün için bir tahmin)
      const dailyForecasts = groupForecastsByDay(forecastData.list);
      setForecastData(dailyForecasts);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3 saatlik tahminleri günlük olarak grupla
  const groupForecastsByDay = (forecastList) => {
    const dailyForecasts = {};
    
    forecastList.forEach(forecast => {
      // Tarih kısmını al (saat olmadan)
      const date = forecast.dt_txt.split(' ')[0];
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = forecast;
      }
    });
    
    // Objeyi diziye çevir
    return Object.values(dailyForecasts).slice(0, 5); // Sadece 5 gün
  };

  // Şehir araması yap
  const handleCitySearch = () => {
    if (searchCity.trim() === '') return;
    
    setLoading(true);
    fetchWeatherAndForecastByCity(searchCity);
    setSearchCity('');
  };

  // Hava durumu ikonunu al
  const getWeatherIcon = (iconCode) => {
    return \`http://openweathermap.org/img/wn/\${iconCode}@2x.png\`;
  };

  // Hava durumuna göre arka plan resmini al
  const getBackgroundImage = () => {
    if (!weatherData) return weatherBackgrounds.default;
    
    const weatherMain = weatherData.weather[0].main;
    return weatherBackgrounds[weatherMain] || weatherBackgrounds.default;
  };

  // Tarihi formatla
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6FFF" />
          <Text style={styles.loadingText}>Hava durumu yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hata: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={getLocationAndWeather}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: getBackgroundImage() }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          {/* Arama çubuğu */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Şehir ara..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchCity}
              onChangeText={setSearchCity}
              onSubmitEditing={handleCitySearch}
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleCitySearch}
            >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Mevcut hava durumu */}
          <View style={styles.weatherContainer}>
            <Text style={styles.cityName}>{weatherData?.name}</Text>
            
            <View style={styles.tempContainer}>
              <Text style={styles.temperature}>
                {Math.round(weatherData?.main?.temp)}°C
              </Text>
              {weatherData?.weather[0]?.icon && (
                <Image
                  source={{ uri: getWeatherIcon(weatherData.weather[0].icon) }}
                  style={styles.weatherIcon}
                />
              )}
            </View>
            
            <Text style={styles.weatherDescription}>
              {weatherData?.weather[0]?.description}
            </Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Feather name="droplet" size={22} color="white" />
                <Text style={styles.detailText}>
                  {weatherData?.main?.humidity}%
                </Text>
                <Text style={styles.detailLabel}>Nem</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Feather name="wind" size={22} color="white" />
                <Text style={styles.detailText}>
                  {Math.round(weatherData?.wind?.speed * 3.6)} km/s
                </Text>
                <Text style={styles.detailLabel}>Rüzgar</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Feather name="thermometer" size={22} color="white" />
                <Text style={styles.detailText}>
                  {Math.round(weatherData?.main?.feels_like)}°C
                </Text>
                <Text style={styles.detailLabel}>Hissedilen</Text>
              </View>
            </View>
          </View>
          
          {/* 5 günlük tahmin */}
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5 Günlük Tahmin</Text>
            
            <FlatList
              data={forecastData}
              keyExtractor={(item) => item.dt.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.forecastItem}>
                  <Text style={styles.forecastDate}>
                    {formatDate(item.dt_txt)}
                  </Text>
                  <Image
                    source={{ uri: getWeatherIcon(item.weather[0].icon) }}
                    style={styles.forecastIcon}
                  />
                  <Text style={styles.forecastTemp}>
                    {Math.round(item.main.temp)}°C
                  </Text>
                  <Text style={styles.forecastDescription}>
                    {item.weather[0].description}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Önceki stiller aynı
  searchContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: 'white',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  forecastContainer: {
    marginTop: 20,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  forecastItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  forecastDate: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
  },
  forecastDescription: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  retryButton: {
    backgroundColor: '#4A6FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});`,
        challenge: {
          description: '5 günlük hava durumu tahminini gösterin ve kullanıcının farklı şehirler için hava durumu araması yapabilmesini sağlayın.',
          hint: '5 günlük tahmin için forecast API endpoint\'ini kullanın. 3 saatlik tahminleri günlük olarak gruplamak için bir fonksiyon yazın. Şehir araması için bir TextInput ve arama butonu ekleyin.',
          starterCode: `import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  SafeAreaView,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import { Feather, Ionicons } from '@expo/vector-icons';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Hava durumu kodlarına göre arka plan resimleri
const weatherBackgrounds = {
  Clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  Rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  Snow: 'https://images.unsplash.com/photo-1516431883659-655d41c09bf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  Mist: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
  default: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
};

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    // Önceki implementasyon
  };

  const fetchWeatherAndForecastByCoords = async (latitude, longitude) => {
    try {
      // Mevcut hava durumu ve 5 günlük tahmin verilerini çekin
      
    } catch (err) {
      // Hata durumunu yönetin
    } finally {
      // Yükleme durumunu güncelleyin
    }
  };

  const fetchWeatherAndForecastByCity = async (city) => {
    try {
      // Şehir adına göre mevcut hava durumu ve 5 günlük tahmin verilerini çekin
      
    } catch (err) {
      // Hata durumunu yönetin
    } finally {
      // Yükleme durumunu güncelleyin
    }
  };

  // 3 saatlik tahminleri günlük olarak grupla
  const groupForecastsByDay = (forecastList) => {
    // 3 saatlik tahminleri günlük olarak gruplandırın
  };

  // Şehir araması yap
  const handleCitySearch = () => {
    // Şehir araması yapın
  };

  // Hava durumu ikonunu al
  const getWeatherIcon = (iconCode) => {
    // Hava durumu ikonunu döndürün
  };

  // Hava durumuna göre arka plan resmini al
  const getBackgroundImage = () => {
    // Hava durumuna göre arka plan resmini döndürün
  };

  // Tarihi formatla
  const formatDate = (dateStr) => {
    // Tarihi formatlayın
  };

  if (loading) {
    return (
      // Yükleme ekranını gösterin
    );
  }

  if (error) {
    return (
      // Hata ekranını gösterin
    );
  }

  return (
    <ImageBackground
      source={{ uri: getBackgroundImage() }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          {/* Arama çubuğu ekleyin */}
          
          {/* Mevcut hava durumu bilgilerini gösterin */}
          
          {/* 5 günlük tahmin bilgilerini gösterin */}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});`
        }
      }
    ]
  },
  {
    id: 'recipe-app',
    title: 'Yemek Tarifi Uygulaması',
    description: 'Kullanıcıların yemek tarifleri arayabileceği, kaydedebileceği ve paylaşabileceği bir uygulama geliştirin. Arama, filtreleme ve favorilere ekleme özelliklerini öğrenin.',
    image: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
    difficulty: 'Zor',
    category: 'Veri Yönetimi',
    estimatedHours: 8,
    learningGoals: [
      'Karmaşık veri yapılarını yönetme',
      'Arama ve filtreleme işlevselliği',
      'Favorilere ekleme ve yerel depolama',
      'Tab navigasyon ve stack navigasyon',
      'Form validasyonu ve kullanıcı girdisi işleme'
    ],
    steps: [
      {
        id: 'recipe-1',
        title: 'Proje Kurulumu ve Navigasyon',
        description: 'Bu adımda, yemek tarifi uygulamasının temel yapısını ve navigasyon sistemini oluşturacağız.',
        instructions: [
          'Tab navigasyon ve stack navigasyon yapısını oluşturun.',
          'Ana ekran, arama ekranı, favoriler ekranı ve tarif detay ekranı için temel bileşenleri oluşturun.',
          'Ekranlar arası geçişleri test edin.'
        ],
        codeExample: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Ekranlar
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Ana ekran stack navigatoru
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Tarifler' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

// Arama ekranı stack navigatoru
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Tarif Ara' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

// Favoriler ekranı stack navigatoru
function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favorilerim' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = 'home';
            } else if (route.name === 'SearchTab') {
              iconName = 'search';
            } else if (route.name === 'FavoritesTab') {
              iconName = 'heart';
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#FF6B6B',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ tabBarLabel: 'Ana Sayfa' }}
        />
        <Tab.Screen 
          name="SearchTab" 
          component={SearchStack} 
          options={{ tabBarLabel: 'Ara' }}
        />
        <Tab.Screen 
          name="FavoritesTab" 
          component={FavoritesStack} 
          options={{ tabBarLabel: 'Favoriler' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}`,
        challenge: {
          description: 'Yemek tarifi uygulaması için navigasyon yapısını oluşturun. Tab navigasyon ve stack navigasyon kullanarak ana ekran, arama ekranı, favoriler ekranı ve tarif detay ekranı arasında geçiş yapılabilmesini sağlayın.',
          hint: 'createBottomTabNavigator ve createStackNavigator kullanarak navigasyon yapısını oluşturun. Her tab için ayrı bir stack navigator tanımlayın ve tarif detay ekranını her stack\'e ekleyin.',
          starterCode: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Ekranlar (henüz oluşturulmadı, sadece placeholder)
const HomeScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Ana Sayfa</Text></View>;
const SearchScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Arama</Text></View>;
const FavoritesScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Favoriler</Text></View>;
const RecipeDetailScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Tarif Detayı</Text></View>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Ana ekran stack navigatoru
function HomeStack() {
  return (
    // Ana ekran ve tarif detay ekranı için stack navigator oluşturun
  );
}

// Arama ekranı stack navigatoru
function SearchStack() {
  return (
    // Arama ekranı ve tarif detay ekranı için stack navigator oluşturun
  );
}

// Favoriler ekranı stack navigatoru
function FavoritesStack() {
  return (
    // Favoriler ekranı ve tarif detay ekranı için stack navigator oluşturun
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {/* Tab navigator oluşturun ve her tab için uygun stack navigator'ı ekleyin */}
    </NavigationContainer>
  );
}`
        }
      },
      {
        id: 'recipe-2',
        title: 'Tarif Listesi ve Detay Ekranı',
        description: 'Bu adımda, ana ekranda tarif listesini gösterecek ve tarif detay ekranını oluşturacağız.',
        instructions: [
          'Örnek tarif verilerini oluşturun.',
          'Ana ekranda tarifleri liste halinde gösterin.',
          'Tarif detay ekranını tasarlayın.',
          'Bir tarife tıklandığında detay ekranına yönlendirin.'
        ],
        codeExample: `// HomeScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { recipes } from '../data/recipes';

export default function HomeScreen({ navigation }) {
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { 
        id: item.id,
        title: item.title
      })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.recipeMetaContainer}>
          <Text style={styles.recipeCategory}>{item.category}</Text>
          <Text style={styles.recipeMeta}>
            {item.time} • {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  recipeMeta: {
    fontSize: 14,
    color: '#666',
  },
});

// RecipeDetailScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recipes } from '../data/recipes';

export default function RecipeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tarif bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
        
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Feather name="heart" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.recipeMetaContainer}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={18} color="#666" />
            <Text style={styles.metaText}>{recipe.time}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Feather name="bar-chart-2" size={18} color="#666" />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Feather name="users" size={18} color="#666" />
            <Text style={styles.metaText}>{recipe.servings} kişilik</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Malzemeler</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazırlanışı</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
  },
  recipeImage: {
    width: '100%',
    height: 250,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  favoriteButton: {
    padding: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
});

// data/recipes.js
export const recipes = [
  {
    id: 1,
    title: 'Fırında Tavuk',
    category: 'Ana Yemek',
    time: '45 dk',
    difficulty: 'Orta',
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ingredients: [
      '4 adet tavuk but',
      '3 yemek kaşığı zeytinyağı',
      '2 diş sarımsak',
      '1 tatlı kaşığı kekik',
      '1 tatlı kaşığı kırmızı toz biber',
      'Tuz ve karabiber'
    ],
    instructions: [
      'Fırını 200°C\'ye ısıtın.',
      'Tavuk butlarını yıkayıp kurulayın.',
      'Bir kasede zeytinyağı, ezilmiş sarımsak, kekik, kırmızı toz biber, tuz ve karabiberi karıştırın.',
      'Tavukları bu karışımla iyice kaplayın.',
      'Tavukları fırın tepsisine yerleştirin ve önceden ısıtılmış fırında 40-45 dakika pişirin.',
      'Tavuklar altın rengi olana ve içi tamamen pişene kadar pişirmeye devam edin.'
    ]
  },
  {
    id: 2,
    title: 'Mercimek Çorbası',
    category: 'Çorba',
    time: '30 dk',
    difficulty: 'Kolay',
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    ingredients: [
      '1 su bardağı kırmızı mercimek',
      '1 adet soğan',
      '1 adet havuç',
      '1 yemek kaşığı un',
      '2 yemek kaşığı tereyağı',
      '6 su bardağı su veya et suyu',
      'Tuz ve karabiber'
    ],
    instructions: [
      'Mercimeği yıkayıp süzün.',
      'Soğan ve havucu küçük küpler halinde doğrayın.',
      'Tencerede tereyağını eritin ve soğanları pembeleşene kadar kavurun.',
      'Havuçları ekleyin ve 2-3 dakika daha kavurun.',
      'Unu ekleyin ve kokusu çıkana kadar kavurun.',
      'Mercimek ve suyu ekleyin, kaynamaya bırakın.',
      'Mercimekler yumuşayana kadar yaklaşık 20-25 dakika pişirin.',
      'Çorbayı blenderdan geçirin ve tuz, karabiber ekleyerek servis yapın.'
    ]
  },
  // Daha fazla tarif eklenebilir
];`,
        challenge: {
          description: 'Ana ekranda tarif listesini gösterin ve tarif detay ekranını oluşturun. Bir tarife tıklandığında detay ekranına yönlendirin.',
          hint: 'FlatList kullanarak tarifleri listelemek için bir bileşen oluşturun. Tarif detay ekranında ScrollView kullanarak tüm içeriği gösterin. navigation.navigate() ile ekranlar arası geçiş yapın.',
          starterCode: `// HomeScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { recipes } from '../data/recipes'; // Bu dosyayı oluşturmanız gerekecek

export default function HomeScreen({ navigation }) {
  // Tarif öğesini render etmek için bir fonksiyon oluşturun
  const renderRecipeItem = ({ item }) => (
    // Tarif kartını oluşturun ve onPress olayını ekleyin
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* FlatList kullanarak tarifleri listeleyin */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});

// RecipeDetailScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recipes } from '../data/recipes';

export default function RecipeDetailScreen({ route, navigation }) {
  // route.params'dan tarif ID'sini alın
  
  // ID'ye göre tarifi bulun
  
  // Tarif bulunamazsa hata mesajı gösterin
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tarif resmini gösterin */}
        
        {/* Tarif başlığı ve favori butonunu içeren başlık bölümünü oluşturun */}
        
        {/* Pişirme süresi, zorluk ve porsiyon bilgilerini gösterin */}
        
        {/* Malzemeler listesini gösterin */}
        
        {/* Hazırlanış adımlarını gösterin */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});

// data/recipes.js
export const recipes = [
  // Örnek tarif verilerini oluşturun
];`
        }
      },
      {
        id: 'recipe-3',
        title: 'Arama ve Filtreleme İşlevselliği',
        description: 'Bu adımda, kullanıcıların tarifleri arayabilmesi ve filtreleyebilmesi için gerekli işlevselliği ekleyeceğiz.',
        instructions: [
          'Arama ekranına arama çubuğu ekleyin.',
          'Kategori filtreleme seçenekleri ekleyin.',
          'Arama sonuçlarını gösterin.',
          'Arama geçmişini saklayın.'
        ],
        codeExample: `// SearchScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recipes } from '../data/recipes';

const SEARCH_HISTORY_KEY = 'recipe_search_history';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Kategorileri yükle
  useEffect(() => {
    // Benzersiz kategorileri al
    const uniqueCategories = [...new Set(recipes.map(recipe => recipe.category))];
    setCategories(uniqueCategories);
    
    // Arama geçmişini yükle
    loadSearchHistory();
  }, []);

  // Arama geçmişini yükle
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  // Arama geçmişini kaydet
  const saveSearchHistory = async (query) => {
    try {
      // Aynı sorguyu tekrar eklemeyi önle
      const updatedHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, 5); // Son 5 aramayı sakla
      
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // Arama yap
  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    
    // Arama geçmişine ekle
    saveSearchHistory(query);
    
    // Arama sonuçlarını filtrele
    setTimeout(() => {
      let results = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      // Kategori filtresi uygulanmışsa
      if (selectedCategory) {
        results = results.filter(recipe => recipe.category === selectedCategory);
      }
      
      setSearchResults(results);
      setLoading(false);
      setShowHistory(false);
    }, 500); // Gerçek bir API çağrısını simüle etmek için küçük bir gecikme
  };

  // Kategori seç
  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
    
    // Mevcut arama sorgusunu kullanarak sonuçları güncelle
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  // Arama geçmişinden bir sorgu seç
  const handleHistoryItemPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Arama sonuçlarını render et
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { 
        id: item.id,
        title: item.title
      })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.recipeMetaContainer}>
          <Text style={styles.recipeCategory}>{item.category}</Text>
          <Text style={styles.recipeMeta}>
            {item.time} • {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Arama geçmişini render et
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleHistoryItemPress(item)}
    >
      <Feather name="clock" size={16} color="#666" />
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tarif veya malzeme ara..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.trim() === '') {
                setSearchResults([]);
                setShowHistory(true);
              } else {
                setShowHistory(false);
              }
            }}
            onSubmitEditing={() => handleSearch()}
            onFocus={() => setShowHistory(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowHistory(true);
              }}
            >
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}
        >
          <Text style={styles.searchButtonText}>Ara</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.selectedCategoryChip
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text 
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.selectedCategoryChipText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      ) : showHistory && searchHistory.length > 0 ? (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Son Aramalar</Text>
            <TouchableOpacity
              onPress={async () => {
                setSearchHistory([]);
                await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
              }}
            >
              <Text style={styles.clearHistoryText}>Temizle</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            keyExtractor={(item, index) => \`history-\${index}\`}
            renderItem={renderHistoryItem}
          />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : searchQuery.trim() !== '' ? (
        <View style={styles.noResultsContainer}>
          <Feather name="search" size={50} color="#ccc" />
          <Text style={styles.noResultsText}>
            "{searchQuery}" için sonuç bulunamadı
          </Text>
          <Text style={styles.noResultsSubtext}>
            Farklı anahtar kelimeler veya kategoriler deneyin
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryChip: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  categoryChipText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  recipeMeta: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  historyContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});`,
        challenge: {
          description: 'Arama ekranına arama çubuğu ve kategori filtreleme seçenekleri ekleyin. Kullanıcıların tarifleri arayabilmesini ve filtreleyebilmesini sağlayın.',
          hint: 'TextInput kullanarak arama çubuğu oluşturun. FlatList kullanarak kategori filtreleri ve arama sonuçlarını gösterin. AsyncStorage kullanarak arama geçmişini saklayın.',
          starterCode: `// SearchScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recipes } from '../data/recipes';

const SEARCH_HISTORY_KEY = 'recipe_search_history';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Kategorileri ve arama geçmişini yükle
  useEffect(() => {
    // Benzersiz kategorileri al
    
    // Arama geçmişini yükle
  }, []);

  // Arama geçmişini yükle
  const loadSearchHistory = async () => {
    try {
      // AsyncStorage'dan arama geçmişini yükleyin
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  // Arama geçmişini kaydet
  const saveSearchHistory = async (query) => {
    try {
      // Arama geçmişini güncelleyin ve AsyncStorage'a kaydedin
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  // Arama yap
  const handleSearch = (query = searchQuery) => {
    // Arama işlemini gerçekleştirin
  };

  // Kategori seç
  const handleCategorySelect = (category) => {
    // Kategori seçimini güncelleyin ve sonuçları filtrelemek için arama yapın
  };

  // Arama geçmişinden bir sorgu seç
  const handleHistoryItemPress = (query) => {
    // Seçilen sorguyu kullanarak arama yapın
  };

  // Arama sonuçlarını render et
  const renderRecipeItem = ({ item }) => (
    // Tarif kartını oluşturun
  );

  // Arama geçmişini render et
  const renderHistoryItem = ({ item }) => (
    // Arama geçmişi öğesini oluşturun
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Arama çubuğunu oluşturun */}
      
      {/* Kategori filtrelerini oluşturun */}
      
      {/* Yükleme durumu, arama geçmişi veya arama sonuçlarını gösterin */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});`
        }
      },
      {
        id: 'recipe-4',
        title: 'Favorilere Ekleme ve Veri Kalıcılığı',
        description: 'Bu adımda, kullanıcıların tarifleri favorilere ekleyebilmesi ve bu verilerin cihazda kalıcı olarak saklanması için gerekli işlevselliği ekleyeceğiz.',
        instructions: [
          'Favorilere ekleme/çıkarma işlevselliği ekleyin.',
          'Favorileri AsyncStorage\'da saklayın.',
          'Favoriler ekranını oluşturun.',
          'Tarif detay ekranında favori durumunu gösterin.'
        ],
        codeExample: `// context/FavoritesContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'recipe_favorites';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Favorileri yükle
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, []);

  // Favorileri kaydet
  const saveFavorites = async (updatedFavorites) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  // Favorilere ekle/çıkar
  const toggleFavorite = (recipeId) => {
    const isFavorite = favorites.includes(recipeId);
    let updatedFavorites;
    
    if (isFavorite) {
      // Favorilerden çıkar
      updatedFavorites = favorites.filter(id => id !== recipeId);
    } else {
      // Favorilere ekle
      updatedFavorites = [...favorites, recipeId];
    }
    
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  // Favori durumunu kontrol et
  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook
export const useFavorites = () => useContext(FavoritesContext);

// App.js (güncellendi)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { FavoritesProvider } from './context/FavoritesContext';

// ... diğer importlar

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        {/* ... mevcut navigasyon yapısı */}
      </NavigationContainer>
    </FavoritesProvider>
  );
}

// RecipeDetailScreen.js (güncellendi)
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recipes } from '../data/recipes';
import { useFavorites } from '../context/FavoritesContext';

export default function RecipeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const recipe = recipes.find(r => r.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const recipeIsFavorite = isFavorite(id);

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tarif bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
        
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(id)}
          >
            <Feather 
              name={recipeIsFavorite ? "heart" : "heart"} 
              size={24} 
              color={recipeIsFavorite ? "#FF6B6B" : "#ccc"} 
              solid={recipeIsFavorite}
            />
          </TouchableOpacity>
        </View>
        
        {/* ... geri kalan içerik aynı */}
      </ScrollView>
    </SafeAreaView>
  );
}

// FavoritesScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recipes } from '../data/recipes';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites, loading, toggleFavorite } = useFavorites();
  
  // Favori tarifleri al
  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { 
        id: item.id,
        title: item.title
      })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Feather name="heart" size={24} color="#FF6B6B" />
      </TouchableOpacity>
      
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.recipeMetaContainer}>
          <Text style={styles.recipeCategory}>{item.category}</Text>
          <Text style={styles.recipeMeta}>
            {item.time} • {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Favoriler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Henüz favori tarifiniz yok</Text>
          <Text style={styles.emptyText}>
            Beğendiğiniz tarifleri favorilere ekleyerek burada görüntüleyebilirsiniz.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.browseButtonText}>Tariflere Göz At</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  recipeMeta: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});`,
        challenge: {
          description: 'Kullanıcıların tarifleri favorilere ekleyebilmesi ve bu verilerin cihazda kalıcı olarak saklanması için gerekli işlevselliği ekleyin.',
          hint: 'Context API kullanarak favori durumunu global olarak yönetin. AsyncStorage kullanarak favorileri cihazda saklayın. Favoriler ekranında favori tarifleri gösterin ve tarif detay ekranında favori durumunu gösterin.',
          starterCode: `// context/FavoritesContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'recipe_favorites';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Favorileri yükle
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // AsyncStorage'dan favorileri yükleyin
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, []);

  // Favorileri kaydet
  const saveFavorites = async (updatedFavorites) => {
    try {
      // Favorileri AsyncStorage'a kaydedin
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  // Favorilere ekle/çıkar
  const toggleFavorite = (recipeId) => {
    // Favori durumunu kontrol edin ve güncelleyin
  };

  // Favori durumunu kontrol et
  const isFavorite = (recipeId) => {
    // Bir tarifin favori olup olmadığını kontrol edin
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook
export const useFavorites = () => useContext(FavoritesContext);

// RecipeDetailScreen.js (güncellendi)
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recipes } from '../data/recipes';
import { useFavorites } from '../context/FavoritesContext';

export default function RecipeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const recipe = recipes.find(r => r.id === id);
  // useFavorites hook'unu kullanarak favori durumunu ve toggle fonksiyonunu alın
  
  // Tarifin favori olup olmadığını kontrol edin
  
  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tarif bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
        
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          {/* Favori butonunu ekleyin */}
        </View>
        
        {/* ... geri kalan içerik */}
      </ScrollView>
    </SafeAreaView>
  );
}

// FavoritesScreen.js
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { recipes } from '../data/recipes';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  // useFavorites hook'unu kullanarak favori durumunu ve toggle fonksiyonunu alın
  
  // Favori tarifleri filtreleyerek alın
  
  // Tarif öğesini render etmek için bir fonksiyon oluşturun
  
  // Yükleme durumunu kontrol edin
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Favori tarifler varsa listeleyin, yoksa boş durum mesajı gösterin */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Stilleri tanımlayın
});`
        }
      }
    ]
  }
];