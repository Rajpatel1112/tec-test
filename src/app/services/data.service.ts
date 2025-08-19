import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, orderBy, query, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore,) {}

  getItems(): Observable<any[]> {
    const itemsRef = collection(this.firestore, 'user');
    return collectionData(itemsRef, { idField: 'id' });
  }
  

  createItem(data: any): Promise<any> {
    const itemsRef = collection(this.firestore, 'user');
    return addDoc(itemsRef, {
      ...data, 
    }).finally(() => {
    });
  }

  updateItem(id: string, data: any): Promise<void> {
    const itemRef = doc(this.firestore, 'user', id);
    return updateDoc(itemRef, data).finally(() => {
    });
   
  }

  // deleteItem(id: string): Promise<void> {
  //   const itemRef = doc(this.firestore, 'user', id);
  //   return deleteDoc(itemRef).finally(() => {
  //   });
  // }

}


