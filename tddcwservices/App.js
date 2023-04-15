import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import RNFetchBlob from 'rn-fetch-blob';

export default function App() {
  async function pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      if (result.type === 'success') {
        console.log('Document picked:', result.uri);
        uploadFile(result.uri);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  }

  async function uploadFile(uri) {
    try {
      const response = await RNFetchBlob.fetch('POST', 'https://your-server.com/upload', {
        'Content-Type': 'multipart/form-data',
      }, [
        {
          name: 'file',
          filename: 'example.xlsx',
          data: RNFetchBlob.wrap(uri),
        },
      ]);

      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async function downloadAndShareFile(url) {
    try {
      const fileUri = FileSystem.documentDirectory + 'example.xlsx';
      await FileSystem.downloadAsync(url, fileUri);

      if (!(await Sharing.isAvailableAsync())) {
        console.error('Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error downloading and sharing file:', error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Pick and Upload Excel File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => downloadAndShareFile('https://your-server.com/path/to/example.xlsx')}
      >
        <Text style={styles.buttonText}>Download and Share Excel File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
