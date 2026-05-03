import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Service = string;
const API = 'http://localhost:8080';

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service>('');
  const [name, setName] = useState('');
  const [startAt, setStartAt] = useState('');
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState(0);

  const tier = useMemo(() => points >= 6000 ? 'Platinum' : points >= 3000 ? 'Gold' : points >= 1000 ? 'Silver' : 'Bronze', [points]);

  useEffect(() => {
    fetch(`${API}/services`).then((r) => r.json()).then((d) => setServices(d.services)).catch(() => setServices([]));
  }, []);

  const book = async () => {
    if (!selectedService || !name || !startAt) return Alert.alert('Missing fields');
    const res = await fetch(`${API}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName: name, service: selectedService, startAt, phone })
    });
    const data = await res.json();
    if (!res.ok) return Alert.alert('Booking failed', JSON.stringify(data));
    setPoints(data.loyalty.points);

    await Notifications.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({ content: { title: 'Booked', body: `${selectedService} @ ${startAt}` }, trigger: null });
    Alert.alert('Booked', `Points: ${data.loyalty.points}`);
  };

  return <SafeAreaView style={s.root}><ScrollView contentContainerStyle={s.c}>
    <Text style={s.h1}>BarberJohn22</Text>
    <Text style={s.h2}>Book. Watch reels. Earn rewards.</Text>
    <Text style={s.sec}>Services</Text>
    {services.map((x) => <Pressable key={x} style={[s.card, selectedService === x && s.sel]} onPress={() => setSelectedService(x)}><Text>{x}</Text></Pressable>)}
    <TextInput style={s.input} placeholder='Name' value={name} onChangeText={setName} />
    <TextInput style={s.input} placeholder='Phone (+1...)' value={phone} onChangeText={setPhone} />
    <TextInput style={s.input} placeholder='YYYY-MM-DDTHH:mm:ssZ' value={startAt} onChangeText={setStartAt} />
    <Pressable style={s.btn} onPress={book}><Text>Book appointment</Text></Pressable>
    <Text style={s.sec}>Loyalty</Text>
    <View style={s.card}><Text>Points: {points}</Text><Text>Tier: {tier}</Text></View>
    <Text style={s.sec}>Instagram</Text>
    <Pressable style={s.card} onPress={() => Linking.openURL('https://www.instagram.com/barberjohn22/reels/')}><Text>@barberjohn22 reels</Text></Pressable>
  </ScrollView><StatusBar style='auto' /></SafeAreaView>;
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: '#0e0e0e' }, c: { padding: 16, gap: 10 }, h1: { color: '#fff', fontSize: 32, fontWeight: '700' }, h2: { color: '#ddd' }, sec: { color: '#f8b400', fontSize: 20, marginTop: 10 }, card: { backgroundColor: '#fff', padding: 12, borderRadius: 8 }, sel: { borderWidth: 2, borderColor: '#f8b400' }, input: { backgroundColor: '#fff', padding: 10, borderRadius: 8 }, btn: { backgroundColor: '#f8b400', padding: 12, borderRadius: 8, alignItems: 'center' } });
