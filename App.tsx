import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IPressableProps {
  pressed: boolean;
}

interface IToDos {
  [key: string]: {
    text: string;
    working: boolean;
  };
}

const STORAGE_KEY = '@toDos';

export default function App() {
  const [working, setWorking] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const [toDos, setToDos] = useState<IToDos>({});
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const handlePressable = ({ pressed }: IPressableProps) => [
    { opacity: pressed ? 0.2 : 1 },
  ];
  const onChangeText = (payload: string) => setText(payload);
  const saveToDos = async (newToDo: IToDos) => {
    try {
      const json = JSON.stringify(newToDo);
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      console.error(error);
    }
  };
  const loadToDos = async () => {
    try {
      const json: string | null = await AsyncStorage.getItem(STORAGE_KEY);
      json !== null ? setToDos(JSON.parse(json)) : null;
    } catch (error) {
      console.error(error);
    }
  };
  const addToDo = async () => {
    if (text === '') return;
    const newToDos: IToDos = {
      ...toDos,
      [Date.now()]: { text, working },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Pressable style={handlePressable} onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}
          >
            Work
          </Text>
        </Pressable>
        <Pressable style={handlePressable} onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.grey,
            }}
          >
            Travel
          </Text>
        </Pressable>
      </View>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
        returnKeyType={'done'}
        style={styles.input}
        placeholder={working ? 'Add a To do!' : 'Where do you want to go?'}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.appBg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 36,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  toDoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
});
