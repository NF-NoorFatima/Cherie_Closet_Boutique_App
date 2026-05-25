import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SalesInsightsScreen({ navigation }) {
  const [topUser, setTopUser] = useState(null);
  const [topRatedProduct, setTopRatedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    await Promise.all([
      fetchTopLoyaltyEarner(),
      fetchTopRatedProduct()
    ]);
    setLoading(false);
  };

  // 🔹 Fetch top user based on loyalty points
  const fetchTopLoyaltyEarner = async () => {
    try {
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Users.json');
      const users = await response.json();

      let maxPoints = -1;
      let topUser = null;

      for (const key in users) {
        const user = users[key];
        if (user.loyaltyPoints && user.loyaltyPoints > maxPoints) {
          maxPoints = user.loyaltyPoints;
          topUser = { name: user.username || 'Unknown', loyaltyPoints: user.loyaltyPoints };
        }
      }

      setTopUser(topUser);
    } catch (error) {
      console.error('Error fetching top loyalty earner:', error);
    }
  };

  // 🔹 Fetch top-rated product based on reviews
  const fetchTopRatedProduct = async () => {
    try {
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Reviews.json');
      const reviews = await response.json();

      if (!reviews) {
        setTopRatedProduct(null);
        return;
      }

      const ratingsMap = {}; // productId: [ratings]

      for (const key in reviews) {
        const { productId, rating } = reviews[key];
        if (productId && rating) {
          if (!ratingsMap[productId]) {
            ratingsMap[productId] = [];
          }
          ratingsMap[productId].push(rating);
        }
      }

      let topProductId = null;
      let highestAvg = -1;

      for (const productId in ratingsMap) {
        const ratings = ratingsMap[productId];
        const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;

        if (average > highestAvg) {
          highestAvg = average;
          topProductId = productId;
        }
      }

      if (topProductId) {
        // Fetch product details from All Products
        const prodRes = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/All Products/${topProductId}.json`);
        const productData = await prodRes.json();

        if (productData) {
          setTopRatedProduct({
            name: productData.name || 'Unnamed',
            avgRating: highestAvg.toFixed(1),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching top rated product:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Sales Insights" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C9A8A" />
            <Text style={styles.loadingText}>Fetching latest insights...</Text>
          </View>
        ) : (
          <>
            <View style={styles.introContainer}>
              <Text style={styles.introText}>Track your store's performance and customer engagement.</Text>
            </View>

            {/* Top Loyalty Earner */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#FDF7E2' }]}>
                  <Ionicons name="trophy" size={24} color="#D4AF37" />
                </View>
                <Text style={styles.statTitle}>Top Loyalty Earner</Text>
              </View>
              {topUser ? (
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{topUser.name}</Text>
                  <Text style={styles.statSubtext}>{topUser.loyaltyPoints} points earned</Text>
                </View>
              ) : (
                <Text style={styles.noDataText}>No user data found.</Text>
              )}
            </View>

            {/* Top Rated Product */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="star" size={24} color="#7C9A8A" />
                </View>
                <Text style={styles.statTitle}>Top Rated Product</Text>
              </View>
              {topRatedProduct ? (
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{topRatedProduct.name}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.statSubtext}>{topRatedProduct.avgRating} Average Rating</Text>
                    <Ionicons name="star" size={14} color="#7C9A8A" style={{ marginLeft: 4 }} />
                  </View>
                </View>
              ) : (
                <Text style={styles.noDataText}>No ratings available yet.</Text>
              )}
            </View>

            {/* Most Viewed Product Placeholder */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="eye" size={24} color="#2196F3" />
                </View>
                <Text style={styles.statTitle}>Product Visibility</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>Engagement Tracking</Text>
                <Text style={styles.statSubtext}>View count analytics coming soon.</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={fetchInsights}>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.refreshButtonText}>Refresh Insights</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    padding: 20,
  },
  loadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#9E8E85',
    fontSize: 14,
  },
  introContainer: {
    marginBottom: 25,
  },
  introText: {
    fontSize: 14,
    color: '#9E8E85',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statContent: {
    paddingLeft: 59,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 14,
    color: '#9E8E85',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noDataText: {
    paddingLeft: 59,
    fontSize: 14,
    color: '#9E8E85',
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: '#7C9A8A',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
