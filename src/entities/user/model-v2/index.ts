// Types
export type {
  Gender,
  SearchType,
  UserRegistrationData,
  UserListItem,
  UserListItemWithMatches,
  UserProfile,
  AuthUser,
  AuthState,
  UsersState,
} from './types';

// Users slice
export {
  default as usersReducerV2,
  setUserListItems,
  addUserListItems,
  updateUserListItem,
  removeUserListItem,
  setUserProfile,
  updateUserProfile,
  toggleLikedSkill,
  setLoading,
  setError,
  resetUsers,
} from './slice';

// Users thunks
export {
  fetchUserListItemsThunk,
  fetchUserProfileThunk,
  updateUserProfileThunk,
  toggleSkillLikeThunk,
  fetchRecommendedUsersThunk,
  fetchPopularUsersThunk,
  fetchNewUsersThunk,
} from './thunks';

// Users selectors
export {
  selectUsersV2State,
  selectUserListItemsIds,
  selectUserListItemsEntities,
  selectUserProfilesIds,
  selectUserProfilesEntities,
  selectUsersLoading,
  selectUsersError,
  selectAllUserListItems,
  selectUserListItemById,
  selectUserProfileById,
  selectUserListItemsWithMatches,
  selectIsSkillLikedByUser,
  selectUserLikedSkills,
  selectUsersByCity,
  selectUsersByGender,
} from './selectors';

// Auth slice
export {
  default as authReducerV2,
  loginSuccess,
  loginStart,
  loginFailure,
  logout,
  updateAuthUser,
  clearError,
} from './authSlice';

// Auth selectors
export {
  selectAuthV2State,
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthUserId,
  selectAuthUserName,
  selectAuthUserAvatar,
  selectAuthUserEmail,
  selectAuthToken,
  selectHasValidSession,
} from './authSelectors';
