#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define MAX_LOAD 15 // Maximum load of the bridge in tonnes
#define CAR_WEIGHT 5 // Weight of a car in tonnes
#define TRUCK_WEIGHT 15 // Weight of a truck in tonnes

pthread_mutex_t lock; // Mutex to protect bridge access
pthread_cond_t condVoiture; // Condition variable for bridge access
pthread_cond_t condCamion;

int current_load = 0; // Current load on the bridge

// Function to access the bridge
void access_bridge(int weight) {
    pthread_mutex_lock(&lock);
    while (current_load + weight > MAX_LOAD) {
        if (weight == CAR_WEIGHT)
        pthread_cond_wait(&condVoiture, &lock); // Wait until the bridge can handle this vehicle
        else if (weight == TRUCK_WEIGHT)
        pthread_cond_wait(&condCamion, &lock);

    }
    current_load += weight; // Add the vehicle weight to the bridge load
    printf("Vehicle of %d tonnes enters the bridge. Current load: %d tonnes.\n", weight, current_load);
    pthread_mutex_unlock(&lock);
}

// Function to leave the bridge
void leave_bridge(int weight) {
    pthread_mutex_lock(&lock);
    current_load -= weight; // Subtract the vehicle weight from the bridge load
    printf("Vehicle of %d tonnes leaves the bridge. Current load: %d tonnes.\n", weight, current_load);
    if (current_load>0); // Wake up all waiting threads
    pthread_cond_signal(&condVoiture);
    else if (current_load=0)
    pthread_cond_signal(&condCamion);
    pthread_mutex_unlock(&lock);
}

// Function to simulate a car crossing the bridge
void* car(void* arg) {
    access_bridge(CAR_WEIGHT); // Car enters the bridge
    sleep(1); // Time spent on the bridge
    leave_bridge(CAR_WEIGHT); // Car leaves the bridge
    return NULL;
}

// Function to simulate a truck crossing the bridge
void* truck(void* arg) {
    access_bridge(TRUCK_WEIGHT); // Truck enters the bridge
    sleep(2); // Time spent on the bridge
    leave_bridge(TRUCK_WEIGHT); // Truck leaves the bridge
    return NULL;
}

int main() {
    pthread_t vehicles[10];
    pthread_mutex_init(&lock, NULL);
    pthread_cond_init(&cond, NULL);

    // Creating threads to simulate cars and trucks
    for (int i = 0; i < 10; i++) {
        if (i % 4 == 0) { // Every 4th vehicle is a truck
            pthread_create(&vehicles[i], NULL, truck, NULL);
        } else {
            pthread_create(&vehicles[i], NULL, car, NULL);
        }
    }

    // Waiting for all threads to finish
    for (int i = 0; i < 10; i++) {
        pthread_join(vehicles[i], NULL);
    }

    // Clean up
    pthread_mutex_destroy(&lock);
    pthread_cond_destroy(&cond);

    return 0;
}
