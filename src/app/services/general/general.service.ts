import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private dialogChoice = new BehaviorSubject(null);
  private branchChoice = new BehaviorSubject(null);
  private confirmChoice = new Subject<boolean>();
  private lang = new BehaviorSubject('ar');
  private heading = new BehaviorSubject('');
  
  constructor() {
   
  }
  public getDialogChoice(): Observable<any> {
    return this.dialogChoice.asObservable();
  }
  public setDialogChoice(choice: any) {
    return this.dialogChoice.next(choice);
  }
  public getBranchChoice(): Observable<any> {
    return this.branchChoice.asObservable();
  }
  public setBranchChoice(choice: any) {
    return this.branchChoice.next(choice);
  }
  public setLang(lang: string) {
    return this.lang.next(lang);
  }
  public getLang(): Observable<string> {
    return this.lang.asObservable();
  }
  public setHeading(heading: string) {
    return this.heading.next(heading);
  }
  public getHeading(): Observable<string> {
    return this.heading.asObservable();
  }
  public getConfirmChoice():Observable<boolean>{
    return this.confirmChoice.asObservable();
  }
  public setConfirmChoice(choice: boolean) {
    return this.confirmChoice.next(choice);
  }
}
