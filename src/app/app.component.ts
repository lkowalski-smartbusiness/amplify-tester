import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AuthStateHandler, CognitoUserInterface, onAuthUIStateChange} from '@aws-amplify/ui-components';
import {AuthService} from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'amplify-tester';
  authState;
  user;

  constructor(private ngZone: NgZone, private cdRef: ChangeDetectorRef, public authService: AuthService) {
  }

  ngOnInit(): void {
    onAuthUIStateChange((authState, authData) => {
      this.authService.authState = authState;
      this.authService.user = authData as CognitoUserInterface;
      this.authService.authStateProcessor.next({authState, authData});

      /* THIS BREAKS NGZONE
      ALL YOU SEE IN LOGS IS A WARNING:
        core.js:26837 Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?
      BUT IN BIGGER PROJECTS THE CHANGE DETECTION GETS TOTALLY BROKEN - PAGE RELOADS PARTIALLY, INCLUDES PARTS OF PREVIOUS COMPONENT ETC
      */
      this.cdRef.detectChanges();

      // THIS HAPPILY ATTACHES US BACK IN THE REGULAR ANGULAR CHANGE DETECTION CYCLE
      /*this.ngZone.run(() => this.cdRef.detectChanges());*/
    });
  }

  ngOnDestroy(): (authStateHandler: AuthStateHandler) => () => any {
    return onAuthUIStateChange;
  }
}
