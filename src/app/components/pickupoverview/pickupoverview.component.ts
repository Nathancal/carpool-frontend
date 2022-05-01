import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { PickupService } from 'src/app/services/pickup.service';
import tt, { Map, map } from '@tomtom-international/web-sdk-maps';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JourneydetailComponent } from '../journeydetail/journeydetail.component';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatsService } from 'src/app/services/chats.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { ThrowStmt } from '@angular/compiler';
import { User } from 'src/app/models/user.model';
import { UserchatsComponent } from '../userchats/userchats.component';

@Component({
  selector: 'app-pickupoverview',
  templateUrl: './pickupoverview.component.html',
  styleUrls: ['./pickupoverview.component.css'],
})
export class PickupoverviewComponent implements OnInit, OnDestroy {
  constructor(
    public pickupService: PickupService,
    private dialog: MatDialog,
    public chatService: ChatsService,
    public notifierService: NotifierService
  ) {}

  latlng: any;
  pickup: any;
  isPassenger!: boolean;
  isLoading!: boolean;
  ifPassengerDetails: any;
  userInfo: any;
  userCreated: any;
  map!: Map;
  geojson: any;
  routeShown!: boolean;
  distanceMiles: any;
  userId: any;
  isHost!: boolean;
  passengerDetails: any[] = [];

  ngOnInit(): void {
    this.isLoading = true;

    this.userId = sessionStorage['userID'];
    console.log();

    console.log(this.pickup.hostId);
    console.log(this.userId);

    this.checkUserIsPassenger();
    this.loadPassengerInfo();
    console.log(this.pickup);
    if (this.userId == this.pickup.hostId) {
      this.isHost = true;
    } else {
      this.isHost = false;
    }
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
  }

  joinPickup(pickupId: any) {
    console.log('button clicked');

    const userId = sessionStorage['userID'];
    this.pickupService.joinPickup(pickupId, userId).subscribe(
      (res) => {
        this.notifierService.showNotification("you have successfully joined this pickup!", "thanks",4000);
      },
      (err) => {
        this.notifierService.showNotification("Im sorry there was an error joining the pickup please try again.", "ok",4000);

      }
    );
  }

  exitPickup(pickupId: any) {
    const userId = sessionStorage['userID'];
    this.pickupService.exitPickup(pickupId, userId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkUserIsPassenger() {
    let userId = sessionStorage['userID'];
    this.pickupService
      .checkUserIsPassenger(this.pickup.pickupId, userId)
      .subscribe(
        (res: any) => {
          this.isPassenger = res.isPassenger;
          console.log(res);
          console.log('is user passenger' + this.isPassenger);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showRoute(pickup: any) {
    this.routeShown = !this.routeShown;

    if (this.routeShown) {
      if (this.map.getLayer('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }
      let route = ttserv
        .calculateRoute({
          key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
          traffic: false,
          locations:
            [
              pickup.embarkLocation.coordinates[1],
              pickup.embarkLocation.coordinates[0],
            ] +
            ':' +
            [
              pickup.returnLocation.coordinates[1],
              pickup.returnLocation.coordinates[0],
            ],
        })
        .then((res) => {
          console.log('route calculated');
          let routeGeojson = res.toGeoJson();
          console.log(
            routeGeojson.features[0].properties.summary.lengthInMeters *
              0.00062137
          );
          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: routeGeojson,
            },
            paint: {
              'line-color': '#ff1744',
              'line-width': 6,
            },
          });
          console.log(routeGeojson);
        });
    } else if (!this.routeShown) {
      if (this.map.getLayer('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }
    }
  }

  loadPassengerInfo() {
    this.pickup.passengers.forEach((passenger: any) => {
      this.pickupService
        .getPassengerDetails(passenger.passengerId)
        .subscribe((res: any) => {
          let passenger = res.data;

          this.chatService
            .checkChatExists(this.userId, passenger.userID)
            .subscribe(
              (res: any) => {
                if (res.data.length < 1) {
                  console.log(res.data);
                  passenger.hasChat = false;
                  this.passengerDetails.push(passenger);

                  console.log(passenger);
                } else {
                  console.log(res.data);
                  passenger.hasChat = true;
                  passenger.chatId = res.data.chatId;
                  this.passengerDetails.push(passenger);

                  console.log(passenger);
                }
              },
              (err: any) => {
                passenger.hasChat = false;
                this.passengerDetails.push(passenger);

                console.log(passenger);
              }
            );

          console.log(res.data);
        });
    });
  }

  sendMessage(chatId: any, userId:any){
    const configDialog = new MatDialogConfig();

    configDialog.id = 'userchatsmodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'user-chats-modal-container';
    configDialog.data = {
      chatId: chatId,
      userId: userId,
      openChat: true
    };
    const modal = this.dialog.open(UserchatsComponent, configDialog);

  }

  startChat(userId: any, recepUserId: any) {
    this.chatService.createChat(userId, recepUserId).subscribe(
      (res: any) => {
        this.notifierService.showNotification(
          'Chat successfully created',
          'Thanks!',
          4000
        );
        const configDialog = new MatDialogConfig();

        let chatId = res.data;

        configDialog.id = 'userchatsmodal';
        configDialog.height = '600px';
        configDialog.width = '100%';
        configDialog.panelClass = 'user-chats-modal-container';
        configDialog.data = {
          chatId: chatId,
          userId: userId,
          openChat: true
        };
        const modal = this.dialog.open(UserchatsComponent, configDialog);
      },
      (err: any) => {
        this.notifierService.showNotification(
          'error occoured creating chat, try again.',
          'OK',
          4000
        );
      }
    );
  }

  capitaliseName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  journeyDetailsModal() {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'journeydetailsmodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'journey-details-modal-container';
    configDialog.data = {
      pickup: this.pickup,
      userInfo: this.userInfo,
      map: this.map,
    };
    const modal = this.dialog.open(JourneydetailComponent, configDialog);
  }
}
