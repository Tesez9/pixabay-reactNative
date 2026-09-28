import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const EXAMPLES = ['cats', 'cars', 'nature', 'dogs', 'space', 'city'];

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [text, setText] = useState('');
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHint((i) => (i + 1) % EXAMPLES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const submit = () => {
    onSearch(text.trim());
  };

  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Feather name="search" size={18} color="#9AA0AA" />
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={submit}
          placeholder={EXAMPLES[hint]}
          placeholderTextColor="#9AA0AA"
          returnKeyType="search"
        />
        {text.length > 0 && (
          <Pressable onPress={() => setText('')} hitSlop={8}>
            <Feather name="x-circle" size={18} color="#9AA0AA" />
          </Pressable>
        )}
      </View>
      <Pressable onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Пошук</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  field: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF1F4',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111111',
    paddingVertical: 0,
  },
  button: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2EC66D',
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
