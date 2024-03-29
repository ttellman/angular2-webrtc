import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService } from '../../../services/rest.service';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material/dialog';
import { ForgotDialog } from '../../dialogs/forgot-dialog/forgot-dialog.component';
import { Store } from '@ngrx/store';


@Component({
    selector: 'login-component',
    templateUrl: './login.template.html',
    styleUrls: ['./login.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent {

    loginform: FormGroup;
    isloading: boolean = false;
    dialogRef: MdDialogRef<ForgotDialog>;


    constructor(
        private authservice: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private restservice: RestService,
        private changeDetectionRef: ChangeDetectorRef,
        public dialog: MdDialog,
        private store: Store<any>
    ) {
        if (this.authservice.isAuthorized) {
            this.router.navigate(['']);
        }
        this.loginform = this.formBuilder.group({
            username: '',
            password: ''
        });
    }

    login(): void {
        this.isloading = true;
        this.restservice.authorizeUser(
            this.loginform.get('username').value,
            this.loginform.get('password').value
        )
            .map((res) => res.json())
            .subscribe(
            (data) => {
                this.isloading = false;
                this.changeDetectionRef.markForCheck();
                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('user_role', data.user.roles[0]);
                localStorage.setItem('user_name', data.user.username);
                this.authservice.setJWT('token');
                this.router.navigate(['']);
            },
            (err) => {
                this.isloading = false;
                this.changeDetectionRef.markForCheck();
                this.loginform.get('password').setValue('');
            }
            );
    }

    openDialog() {
        let config: MdDialogConfig = { disableClose: false };
        this.dialogRef = this.dialog.open(ForgotDialog, config);
        // when closing dialog
        this.dialogRef.afterClosed().subscribe(result => {
        });
    }
}
