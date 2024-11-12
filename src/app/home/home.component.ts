/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, HttpLink, ApolloClientOptions } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importer RouterModule pour utiliser routerLink
import { PhotoCardComponent } from '../photo-card/photo-card.component';

const uri = 'https://rickandmortyapi.com/graphql'; // URL de l'API Rick and Morty GraphQL

export function createApollo(): ApolloClientOptions<any> {
  return {
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  };
}

const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id
        name
        image
        status
        location {
          dimension
        }
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PhotoCardComponent], // Ajout de RouterModule
  providers: [
    provideApollo(createApollo) // Fournir Apollo directement
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Correction de 'styleUrls'
})
export class HomeComponent implements OnInit { // Correction du nom de la classe
  title = 'galerie-photos';
  characters: any[] = []; // Pour stocker les personnages récupérés
  loading = true; // Pour savoir si les données sont en cours de chargement
  error: any; // Pour gérer les erreurs éventuelles

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    // Utiliser Apollo pour exécuter la requête GraphQL
    this.apollo
      .watchQuery({
        query: GET_CHARACTERS
      })
      .valueChanges.subscribe({
        next: (result: any) => {
          console.log(result); // Log pour vérifier le contenu de l'objet
          // Accès aux personnages dans result.data.characters.results
          this.characters = result?.data?.characters?.results;
          this.loading = result.loading; // Mise à jour de l'état de chargement
        },
        error: (error) => {
          console.error('Erreur lors de la requête GraphQL :', error); // Log de l'erreur complet
          this.error = error; // Gérer les erreurs en cas d'échec de la requête
          this.loading = false;
        }
      });
  }
}