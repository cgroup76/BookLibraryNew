using serverSide.BL;
using System;
using System.Collections.Generic;
using System.Linq;

public class KnnUserRecommenderService
{
    private List<UserPurchaseData> allUserPurchaseData;
    private int k;
    private int currentUserId;

    public KnnUserRecommenderService(List<UserPurchaseData> allUserPurchaseData, int k, int currentUserId)
    {
        this.allUserPurchaseData = allUserPurchaseData;
        this.k = k;
        this.currentUserId = currentUserId;
    }

    public List<int> RunKnnAlgorithmOnGeneralizedData(Dictionary<int, double[]> userPreferenceVectors)
    {
        if (!userPreferenceVectors.ContainsKey(currentUserId)) { return null; } // user didn't purchased any books

        double[] currentUserVector = userPreferenceVectors[currentUserId];
        List<Tuple<int, double>> distances = new List<Tuple<int, double>>();

        foreach (var user in userPreferenceVectors)
        {
            if (user.Key == currentUserId) continue;

            double distance = CalculateCosineSimilarity(currentUserVector, user.Value);
            distances.Add(new Tuple<int, double>(user.Key, distance));
        }

        // find the k nearest neighboood
        var nearestNeighbors = distances.OrderBy(d => d.Item2)
                                        .Take(k) // k
                                        .Select(d => d.Item1)
                                        .ToList();

        // Step 2: Find books that nearest neighbors purchased but the current user hasn't
        var currentUserBookIds = allUserPurchaseData
            .Where(p => p.UserId == currentUserId)
            .Select(p => p.BookId)
            .ToHashSet(); // Get a set of books that the current user has already purchased

        var recommendedBooks = new HashSet<int>(); // Use a set to avoid duplicates

        foreach (var neighborId in nearestNeighbors)
        {
            var neighborBooks = allUserPurchaseData
                .Where(p => p.UserId == neighborId && !currentUserBookIds.Contains(p.BookId)) // Books the neighbor bought but not the current user
                .Select(p => p.BookId)
                .ToList();

            recommendedBooks.UnionWith(neighborBooks); // Add books to recommendations
        }

        return recommendedBooks.ToList(); // Convert the set to a list and return
    }

    public Dictionary<int, double[]> BuildUserPreferenceVectorsGeneralized(List<UserPurchaseData> allUserPurchaseData)
    {
        // Get all unique genres, authors, and titles in the dataset
        var uniqueGenres = allUserPurchaseData.Select(p => p.Genre).Distinct().ToList();
        var uniqueAuthors = allUserPurchaseData.Select(p => p.Author).Distinct().ToList();
        var uniqueTitles = allUserPurchaseData.Select(p => p.Title).Distinct().ToList();

        // Create a dictionary to store user preference vectors (currentUserId -> feature vector)
        var userPreferenceVectors = new Dictionary<int, double[]>();

        // Group purchase data by user
        var groupedByUser = allUserPurchaseData.GroupBy(p => p.UserId);

        foreach (var userGroup in groupedByUser)
        {
            int userId = userGroup.Key;
            var userPurchases = userGroup.ToList();

            // Feature 1: Average rating
            double averageRating = userPurchases.Average(p => p.Rating);

            // Initialize vectors for genres, authors, and titles
            double[] genreVector = new double[uniqueGenres.Count];
            double[] authorVector = new double[uniqueAuthors.Count];
            double[] titleVector = new double[uniqueTitles.Count];

            // Populate genre, author, and title vectors with frequencies
            foreach (var purchase in userPurchases)
            {
                // Update genre vector
                int genreIndex = uniqueGenres.IndexOf(purchase.Genre);
                if (genreIndex != -1)
                {
                    genreVector[genreIndex]++;
                }

                // Update author vector
                int authorIndex = uniqueAuthors.IndexOf(purchase.Author);
                if (authorIndex != -1)
                {
                    authorVector[authorIndex]++;
                }

                // Update title vector
                int titleIndex = uniqueTitles.IndexOf(purchase.Title);
                if (titleIndex != -1)
                {
                    titleVector[titleIndex]++;
                }
            }

            // Normalize genre, author, and title vectors (convert counts to frequencies)
            double totalBooks = userPurchases.Count;
            for (int i = 0; i < genreVector.Length; i++)
            {
                genreVector[i] /= totalBooks;
            }
            for (int i = 0; i < authorVector.Length; i++)
            {
                authorVector[i] /= totalBooks;
            }
            for (int i = 0; i < titleVector.Length; i++)
            {
                titleVector[i] /= totalBooks;
            }

            // Combine all features into a single feature vector
            double[] featureVector = new double[1 + genreVector.Length + authorVector.Length + titleVector.Length];
            featureVector[0] = averageRating;
            Array.Copy(genreVector, 0, featureVector, 1, genreVector.Length);
            Array.Copy(authorVector, 0, featureVector, 1 + genreVector.Length, authorVector.Length);
            Array.Copy(titleVector, 0, featureVector, 1 + genreVector.Length + authorVector.Length, titleVector.Length);

            // Add the feature vector for the user
            userPreferenceVectors[userId] = featureVector;
        }

        return userPreferenceVectors;
    }


    private double CalculateCosineSimilarity(double[] user1Vector, double[] user2Vector)
    {
        double distance = 0;

        for (int i = 0; i < user1Vector.Length; i++)
        {
            distance += Math.Pow((user1Vector[i] - user2Vector[i]), 2);
        }

        distance = Math.Sqrt(distance);

        return distance;
    }

}
