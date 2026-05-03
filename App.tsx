import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceUsd: number;
};

const SERVICES: Service[] = [
  { id: 'skin-fade', name: 'Skin Fade / Bald Fade', description: 'Fades directly to bare skin.', durationMin: 45, priceUsd: 45 },
  { id: 'shadow-fade', name: 'Shadow Fade', description: "Subtle blend that doesn't go to skin.", durationMin: 45, priceUsd: 42 },
  { id: 'razor-fade', name: 'Razor Fade', description: 'Skin fade finished with straight razor.', durationMin: 50, priceUsd: 50 },
  { id: 'drop-fade', name: 'Drop Fade', description: 'Fade dips lower in back following skull.', durationMin: 50, priceUsd: 48 },
  { id: 'burst-fade', name: 'Burst Fade', description: 'Circular fade around the ear.', durationMin: 55, priceUsd: 52 },
  { id: 'temp-fade', name: 'Temp / Temple Fade', description: 'Sharp fade at temple area.', durationMin: 40, priceUsd: 40 },
  { id: 'taper-fade', name: 'Taper Fade', description: 'Sideburns and nape only, longer sides.', durationMin: 40, priceUsd: 40 },
  { id: 'afro-fade', name: 'Afro Fade', description: 'Blend high-volume afro into fade.', durationMin: 60, priceUsd: 60 },
  { id: 'high-top-fade', name: 'High Top Fade', description: 'Classic high top with clean fade.', durationMin: 60, priceUsd: 60 }
];

const INSTAGRAM_REELS = [
  'https://www.instagram.com/barberjohn22/reels/',
  'https://www.instagram.com/barberjohn22/'
];

export default function App() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [appointmentISO, setAppointmentISO] = useState('');
  const [points, setPoints] = useState(0);
  const tier = useMemo(() => {
    if (points >= 6000) return 'Platinum';
    if (points >= 3000) return 'Gold';
    if (points >= 1000) return 'Silver';
    return 'Bronze';
  }, [points]);

  const book = async () => {
    if (!selectedService || !name || !appointmentISO) {
      Alert.alert('Missing fields', 'Choose a service, enter your name, and appointment datetime.');
      return;
    }

    // Placeholder: send to backend to create appointment + Google Calendar event.
    const earned = selectedService.priceUsd * 10;
    setPoints((p) => p + earned);

    await Notifications.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Appointment confirmed',
        body: `${selectedService.name} booked for ${appointmentISO}`
      },
      trigger: null
    });

    Alert.alert('Booked', `Thanks ${name}. You earned ${earned} points.`);
  };

  const scheduleRebookReminder = async () => {
    await Notifications.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for a fresh cut 🔥',
        body: 'It has been 30 days since your last visit. Tap to rebook now.'
      },
      trigger: {
        seconds: 30 * 24 * 60 * 60
      }
    });
    Alert.alert('Reminder set', '30-day rebooking reminder scheduled.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>BarberJohn22</Text>
        <Text style={styles.subtitle}>Book fades, watch reels, earn rewards.</Text>

        <Text style={styles.section}>1) Choose your cut</Text>
        {SERVICES.map((service) => (
          <Pressable key={service.id} style={[styles.card, selectedService?.id === service.id && styles.cardSelected]} onPress={() => setSelectedService(service)}>
            <Text style={styles.cardTitle}>{service.name}</Text>
            <Text>{service.description}</Text>
            <Text>${service.priceUsd} • {service.durationMin} min</Text>
          </Pressable>
        ))}

        <Text style={styles.section}>2) Book appointment</Text>
        <TextInput style={styles.input} placeholder="Client name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="YYYY-MM-DD HH:mm" value={appointmentISO} onChangeText={setAppointmentISO} />
        <Pressable style={styles.button} onPress={book}><Text style={styles.buttonText}>Confirm booking</Text></Pressable>

        <Text style={styles.section}>3) Instagram reels</Text>
        {INSTAGRAM_REELS.map((link) => (
          <Pressable key={link} style={styles.linkButton} onPress={() => Linking.openURL(link)}>
            <Text style={styles.linkText}>{link}</Text>
          </Pressable>
        ))}

        <Text style={styles.section}>4) Loyalty & rewards</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fade Club</Text>
          <Text>Points: {points}</Text>
          <Text>Tier: {tier}</Text>
          <Text>10 points per $1 + streak and referral bonuses.</Text>
        </View>
        <Pressable style={styles.buttonSecondary} onPress={scheduleRebookReminder}><Text>Schedule 30-day rebook reminder</Text></Pressable>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  title: { color: '#fff', fontSize: 34, fontWeight: '700' },
  subtitle: { color: '#ddd', marginBottom: 8 },
  section: { color: '#f8b400', fontSize: 20, fontWeight: '700', marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, gap: 4 },
  cardSelected: { borderWidth: 2, borderColor: '#f8b400' },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#f8b400', borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { fontWeight: '700' },
  linkButton: { backgroundColor: '#1f1f1f', borderRadius: 8, padding: 10 },
  linkText: { color: '#81b0ff' },
  buttonSecondary: { backgroundColor: '#ddd', borderRadius: 8, padding: 10, alignItems: 'center' }
});
