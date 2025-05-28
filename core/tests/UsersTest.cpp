/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#include <boost/test/unit_test.hpp>

#include "pch.h"
#include "User.h"

using namespace RatingSystem;

BOOST_AUTO_TEST_CASE(UserToJsonTest)
{
    const User user{ 1, 5, "John Doe" };
    auto json = ToJson(user);

    BOOST_REQUIRE(json.contains("id"));
    BOOST_REQUIRE(json.contains("score"));
    BOOST_REQUIRE(json.contains("name"));

    BOOST_CHECK_EQUAL(json["id"].as_uint64(), user.id);
    BOOST_CHECK_EQUAL(json["score"].as_uint64(), user.score);
    BOOST_CHECK_EQUAL(json["name"].as_string(), user.name);
}

BOOST_AUTO_TEST_CASE(UsersToJsonTest)
{
    const std::vector<User> users{ { 1, 5, "John Doe" }, { 2, 10, "John Smith" } };

    auto json = ToJson(users);

    BOOST_REQUIRE(json.contains("users"));
    auto arr = json["users"].as_array();

    BOOST_REQUIRE_EQUAL(arr.size(), 2);
    const auto user1 = users[0];
    const auto user2 = users[1];
    auto userJson1 = arr[0].as_object();
    auto userJson2 = arr[1].as_object();

    BOOST_CHECK_EQUAL(userJson1["id"].as_uint64(), user1.id);
    BOOST_CHECK_EQUAL(userJson1["score"].as_uint64(), user1.score);
    BOOST_CHECK_EQUAL(userJson1["name"].as_string(), user1.name);
    BOOST_CHECK_EQUAL(userJson2["id"].as_uint64(), user2.id);
    BOOST_CHECK_EQUAL(userJson2["score"].as_uint64(), user2.score);
    BOOST_CHECK_EQUAL(userJson2["name"].as_string(), user2.name);
}
