# FEUP-SDLE Project

This repository stores the project for the Curricular Unit of [Large Scale Distributed Systems](https://sigarra.up.pt/feup/en/ucurr_geral.ficha_uc_view?pv_ocorrencia_id=501934) project from [FEUP](https://sigarra.up.pt/feup/en/web_page.Inicial).

## Table of Contents

- [Project Overview](#project-overview)
- [Project Theme Overview](#project-theme-overview)
- [Project Structure](#project-structure)
  - [db](#db)
  - [frontend](#frontend)
  - [sync-service](#sync-service)
  - [docs](#docs)
- [Getting Started](#getting-started)
- [License](#license)

## Project Overview

This project explores the creation of a local-first shopping list application within the context of Large Scale Distributed Systems. The application combines local device code for data persistence with a cloud component for data sharing and backup storage.

## Project Features Overview

- Users can create shopping lists with a unique ID for sharing.
- List items can have flags, be checked, or have target quantities.
- Concurrency support using various CRDTs.
- Cloud-side architecture designed for high availability and scalability.



## Project Structure

### [db](./db)

Handles database-related components responsible for storing and retrieving crucial data. These module was developed with strong inspiration in DynamoDB's design.
It features high scalability, availabilty and durability, through the use of techniques such as vector clocks, consistent hashing and hinted handoff as well as sloppy quorums.

### [frontend](./frontend)

Manages the user interface and interaction layer, enabling seamless interaction with the overall system.

### [sync-service](./sync-service)

Deals with data synchronization and consistency across the entire system. In this library we can see a very generic implementation of some types of Conflict-free Replicated Data Types (CRDT's).

### [docs](./docs)

Contains the slideshows used to present our project and the initial design.

## Getting Started

Consult respective service documentation for detailed setup instructions.

## License

This project is licensed under the [MIT License](./LICENSE), allowing use, modification, and distribution as per the license terms.
