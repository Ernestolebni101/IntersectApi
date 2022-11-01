import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../../services/messages.service';

import { ConfigService } from '@nestjs/config';
import { ServiceAccount, storage } from 'firebase-admin';
import * as firebase from 'firebase-admin';
import * as fireorm from 'fireorm';

const internalConfig = {
  FIREBASE_PROJECT_ID: 'intersectiondb-751e5',
  FIREBASE_PRIVATE_KEY:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1975gxep0LDJ1\np11QpIqtdDC1IztZxQK8ONIBeNso3pnm7YtWzmoR/rYQ2kGs/yxd1srbXUrg8KiC\nngDoS+YIWyVDrAqUQi7ukhyLe2yB/imM4whUF8Tz1/X+4vbH5vLwerbTG4MAnCg8\nBWvQcg1nGWmiww2XZcuhD5jiOaMEJXnuhM2OKvOjc1BOOxaQUAd6b3uwbxpbLqc0\n6sazev7kjCDyPoFftGytXRYVwp+ner4xNZ5rbX8dmy+d1pydMFAkDuHiFXjoQP0s\n8egKy6T87fSjs5k0V7MzNHMxVHq1BjrhdmRfcz1fTWffz2Dhnk04dLkSJi/V1idU\ni9+VqgAVAgMBAAECggEAK1druT2SyyJmz2ayf319iXRqEI7oeUiHTwEiphac7sZc\ndmhAfsfR9GDMiUWPDI9HyD8bmLXHGr4/iMLtGOdRDk71WIG/EFKWPp0/HsriTLEW\nwPeneW4i62iWL2RsXq9H0JcN+kjsgkXvgGJTLHYp8pNXOZ0HXPbyUjW2lrWfOiJz\nIWzWi89zaM9bTrtJo/2ZioZU7cvK9VRlPO+74pxJ/s8YP9qoTRimaeUhPtWSsD7V\nkThZxewC/GbTuo3lsoHN6UPb3GrldtmQAifzZAWm3xL+iLYW7D7oGPTKMX3sxfEH\n6l597qDjRHOSdUna4pfrb7UCal9pGhGcpH2TtcIL6QKBgQDfKfG1rqbGsBMeuWme\nZa1WadSR/z/FwUeV6kBPoLUxo/KX5E1hynfUu+SzeC3zo7HQ8qW0owgU0XsVJ12B\nIuaUxROacEI03WyTNyfpIziYZ1lQGC/cDa7x1qXomlYniR3WMG1OI4KO1vr2JsiI\nXPl5wltE+81Cj7J212vrBj0eLQKBgQDQvgopcG5Qm7SFROQoyCdUjfLH34tH+J6A\nITgsHIgrNu4zDsm7a3uq9EctxW6AI7k39kB0jiBZHZ0r+dCHDQ5FXAqhqziXUDrj\nN9pg6VYy3MArsrql4t5UGUgfEzBS/C/d7Rb5A/txHwhUecM/Bvg+gZWcnzEez3+N\n/3TH82qCiQKBgBLTvhGe13Ehv6sy50c2usX0jbt3dlDfuoNaTOyq2T6D316TIzgh\n1bQ72dKOTAonAERphDNWIcNn3ONu+8N+R0e7zKiV2fAN0jAlUheoIgkxhuZr8/Wz\nrdO3US3rf2M8fSjp0v7pngUg+/EyWm6usVllXT/XonyAFQVTrUYZs6RNAoGARcnz\nrc0YJL0aCqBww62/cIaQ0ABOGb7mhyIUHLNhV0ljNBDSo2WZEBvhnEzw18iZyTr8\na7uE1yaOgMBh1nUn+0p9h3WuUvCQ75yh11rL5e9mFHYJ7yI9gNJ/CVyqAGSuQD1f\nO9v3+ecNKukWvQDAiG1cruOOUaXAGKJ60crxJjkCgYB/6GJD13TM0LFYabuQ5Fim\nNx3/Xc2/wuOBdFNNioNP5sU7BDZlSqLhD9N6Ed2EsOoleEVgkCRxMI1RQW7U+j+K\n3M3JzdAKjtoSuqLXdTxkZcIDHyiwNLyNyllxJmOJ7BlgqUSP/Ss4Lz4bVosfjury\nKJK4hW75nxb07ZPltlUpkQ==\n-----END PRIVATE KEY-----\n',
  FIREBASE_CLIENT_EMAIL:
    'firebase-adminsdk-hxrc6@intersectiondb-751e5.iam.gserviceaccount.com',
  DB_URL: 'https://intersectiondb-751e5.firebaseio.com',
  PORT: '8080',
  BUCKET_URL: 'gs://intersectiondb-751e5.appspot.com/',
  TOKEN:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImYyNGYzMTQ4MTk3ZWNlYTUyOTE3YzNmMTgzOGFiNWQ0ODg3ZWEwNzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaW50ZXJzZWN0aW9uZGItNzUxZTUiLCJhdWQiOiJpbnRlcnNlY3Rpb25kYi03NTFlNSIsImF1dGhfdGltZSI6MTY0NDI1MTkzNiwidXNlcl9pZCI6InNTbXBUUGc2MmtmSnl1S1BhbFE0TGhiZE0xNDMiLCJzdWIiOiJzU21wVFBnNjJrZkp5dUtQYWxRNExoYmRNMTQzIiwiaWF0IjoxNjQ0MjUxOTM2LCJleHAiOjE2NDQyNTU1MzYsImVtYWlsIjoiZWRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImVkQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Fm3SIgYSaQ3Dx16M9N4WTJtyCLZLQ1jls_VaGJjcdg6SeCu6hNbwhei5cirYVyNhqxVDeGEoHm3lFq1SxBK3ksgyLoRHvIS6mv_1Y5rYp-WCLhBjF4A7CbqU7K7WVIF62044FYEibgwovFSUoJDugMNI9rw0QSo7V8M9w4MeT-7l2_PlPRQcKMDKgohNLY8_oCWjgcKNNKLHgHuJfJM1R8Yuhv2lyqk4pWAXLrFtKQjHZy08zBnT_lRVOwgzb1mEJKwyGpYbLQAPRfBZmOKcTosM8O-wA5f9s9M_Drx4uKXG1O1mYdusXmQTvylk8m2Yniz1mNY1sUsrP1AhFXxIIg',
  SERVERKEY:
    'AAAAD558p_s:APA91bHX9axNQxobkPxeYcWQuMPiWqRmfmjcH4aZ5yJJg44U-nyuYjEkIbNi5FC3PYTUDGglKE0WULPHRRhXk3mpadF8NQ2Fkgi7lL1qaSQWxwk6TeGPD45isBrPOHK0GthqRuNXtLfz',
  SENDERID: '67083479035',
};

const serviceAccount = {
  type: 'service_account',
  project_id: 'intersectiondb-751e5',
  private_key_id: 'a544217e69fbb90f33a9c89f2c434d10e3851365',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCu/rnQb1IGrQqK\nXLpfbBU3OWq3GnaQ5KqFIY6sL3CJeJ44VuU+q9DfcA5Sb4ViNAl1FWP3bO3sMNAW\n/iFTtqj/BU06B7Tg3Ku25P0Hhi72eXFHWlT3XpC5Dw+SHpgnmKg0VfkR8+WDU/FA\niXhceeP9xRA/NGUcWyjSFoFqjHuDU5/A7PxGECIu7zZUpatE99UzKI5Pu7a3VzOc\nlXgvsu4/CdR4iVVdh5hrr5EoTyE3B4vxqOKLuuBjlyshDmEjDCND8ORzMwUw7r2f\nge19+L/zL57FmXbm1nKcjdXkL6hY3W7a3/4MwFxP+g+ctzHpALpVue9FyaTTY6va\nOOoX5E1rAgMBAAECggEAO9m+FoZEUSk0vi7JxWITfYBDOd2wqIy0r3TTNZvCCxp4\nTr+Vh1I/TXQnSdV/kp9GjsdimdilJQ9q1DpVjqqd8R7Qk2TYXcHLbvGxgrXHcSAG\n+Mbx4Wrz5385rZmOI5jICqJO3e+DU1/N1utNgZ9ktUIFdQCIBmM9OmFdIOJsSfUq\nYcotmu/NVBRFq8uNcRQ/mjZixfrwSOkTbz0u8bcxz/lK+JfMQLxJFdqd7n0IPiaJ\nHE3JP8g6/tC26Wq3/KZYoIgAS77HsGnzey8jyTLF9iT/K3N8ffVJN9yL9x/6dfXG\nQD2409TNF8jULvgFBX8U7t/jCRKNGBqMGmS5hlz6vQKBgQDfn5/1ZrIoCdIsGH2e\nnprdIhdGU5LiOYxo/6h9SHaKnugmTyrjDxKHxvzB9+eIBpFS8oL96VqzC6xe+D7a\nawhYoP7C5PGrWpAd7s2Q7scWikeifAvEV3IIeeySvMpJIQULTp943vzevbpjSMwN\nRyF4LEI9zZSCTSlA4wKzw4ESFQKBgQDIVLxIIElAGGf+i22kQ7XnVch9DKBcbwU8\nQvQ6/o5tWrw7eiXZwlYMEUzWeX6zZ49i3886hVCSl3ZT0wq0yCwGc1unP8p5bo4j\nGFbD7bcJVNzM8ncZ8fz0Lm5B320TFdSPc2CEEIkOD0QNtQNrPlo8nhRwQsRR/S2b\nS4lKcnFBfwKBgHA7sRB9JlUp+K3g7Ms7VwY9IelN8J5Ru8LG7U1TnQsdje4MNb4X\nxnkWyaygOzft8+nphQzinX7XEP/pH8KHjXzN8I7oUNJrdYFQZSOkc49Af4txLoaw\nTK8sYiuTTQM+60UthKQpZkh0eKNz2dWgKZAixmw2TZ7IEzhZtvV53cGxAoGAZ0Ku\nLmtd9ojeCenqoRI50D16c2KvwhWD2FUWuNX/qkRr5CiJHB685cmBFshXU7hcw3Vj\nxuFy76zc1EZjLV5Euyp5ItOR1Vf0MgjYqHN+tnOkwIt2csw2O9M3CANXoM/O2gZ5\nyHkRfErIJFyan4vrTXWaSWdQ9IYRHQwpf1NQJ5cCgYAMHcNSFm3mH37pc+CLOm5n\nHL6ZwchVQhkQNANXDmbramQ4gjEt9jBaqW6VInKbV5hn12L12BDBy0HXVykY1IqB\nO2iuHVDLENn8kfldvYZUzEfxzwFXya9eLADq/qbrdXr6WPvdE7ZNPOO1Z6MSE7BE\ndyZeqcrXjce6qM//cosxAg==\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-hxrc6@intersectiondb-751e5.iam.gserviceaccount.com',
  client_id: '105629713734512140270',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hxrc6%40intersectiondb-751e5.iam.gserviceaccount.com',
};

const configservice = new ConfigService(internalConfig);

let _app: firebase.app.App;
let _db: firebase.firestore.Firestore;
const setConfigurations = (): void => {
  //========================= Db Settings =======================
  const settings = {
    timestampsInSnapshots: true,
  };
  ////=============== Initialize the firebase admin app and Database ================
  _app = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: configservice.get('DB_URL'),
    storageBucket: configservice.get('BUCKET_URL'),
  });
  _db = _app.firestore();
  _db.settings(settings);
  //=============== Initialize Orm for Firebase to Manipulate Data================
  fireorm.initialize(_db);
  console.log('Establish Connection with Intersect-Api');
};
setConfigurations();

describe('MessageCollection', () => {
  let service: MessagesService;
  let messages = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messages = await service.findMessages('KGghiZ3oDLKkYpKycSFK');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(messages).toReturn();
  });
});
