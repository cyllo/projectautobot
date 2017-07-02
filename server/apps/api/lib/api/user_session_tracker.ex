defmodule Api.UserSessionTracker do
  def activate_session(user_id, token), do: ConCache.put(:session_token_store, user_id, token)
  def session_active?(user_id, token), do: ConCache.get(:session_token_store, user_id) === token
  def destroy_session(user_id), do: ConCache.delete(:session_token_store, user_id)
end
