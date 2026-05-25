import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../components/context/UserContext';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

export default function Review({ productId }) {
  const { user } = useContext(UserContext);
  const username = user?.username || 'Guest';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://cheriecloset-default-rtdb.firebaseio.com/Reviews/${productId}.json`
      );
      const data = await res.json();
      const reviewsArray = data ? Object.values(data) : [];
      setReviews(reviewsArray.reverse());
    } catch (error) {
      console.log('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert('Please enter a rating and a comment.');
      return;
    }

    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      alert('Please enter a rating between 1 and 5.');
      return;
    }

    const newReview = {
      username,
      rating: numRating,
      comment,
      date: new Date().toLocaleDateString(),
    };

    try {
      setSubmitting(true);
      await fetch(
        `https://cheriecloset-default-rtdb.firebaseio.com/Reviews/${productId}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview),
        }
      );
      setRating('');
      setComment('');
      fetchReviews();
    } catch (error) {
      console.log('Error submitting review:', error);
      alert('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>WRITE A REVIEW</Text>

        <Text style={styles.fieldLabel}>RATING (1-5)</Text>
        <TextInput
          placeholder="Enter rating"
          keyboardType="numeric"
          value={rating}
          onChangeText={setRating}
          style={[styles.input, focusedInput === 'rating' && styles.inputFocused]}
          onFocus={() => setFocusedInput('rating')}
          onBlur={() => setFocusedInput(null)}
          placeholderTextColor="#9E8E85"
        />

        <Text style={styles.fieldLabel}>YOUR COMMENT</Text>
        <TextInput
          placeholder="Share your experience..."
          value={comment}
          onChangeText={setComment}
          style={[styles.input, styles.textArea, focusedInput === 'comment' && styles.inputFocused]}
          multiline
          onFocus={() => setFocusedInput('comment')}
          onBlur={() => setFocusedInput(null)}
          placeholderTextColor="#9E8E85"
        />

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>SUBMIT REVIEW</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>CLIENT REVIEWS</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{reviews.length}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#7C9A8A" style={{ marginTop: 20 }} />
      ) : reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Be the first to review this piece.</Text>
        </View>
      ) : (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.username}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.ratingRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons 
                  key={i} 
                  name={i < review.rating ? "star" : "star-outline"} 
                  size={14} 
                  color="#7C9A8A" 
                />
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  formCard: {
    backgroundColor: '#FAF7F2',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 45,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  inputFocused: {
    borderColor: '#7C9A8A',
  },
  submitBtn: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#7C9A8A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  reviewDate: {
    fontSize: 11,
    color: '#9E8E85',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 10,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
    color: '#2C2C2C',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9E8E85',
    fontSize: 14,
  },
});

