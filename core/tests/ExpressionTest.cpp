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

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, operationESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#include <boost/test/unit_test.hpp>

#include <numeric>
#include "Expression.h"

using namespace Core;

BOOST_AUTO_TEST_CASE(SimpleNumber)
{
    Constant c(5.0);
    BOOST_CHECK_CLOSE(c.Evaluate(), 5.0, std::numeric_limits<double>::epsilon());

    Constant c2(-3.14);
    BOOST_CHECK_CLOSE(c2.Evaluate(), -3.14, std::numeric_limits<double>::epsilon());

    Constant c3(0.0);
    BOOST_CHECK_CLOSE(c3.Evaluate(), 0.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(Subtraction)
{
    BinaryOperation operation(
        Operation::Sub,
        Constant(5.0),
        Constant(2.0)
    );
    BOOST_CHECK_CLOSE(operation.Evaluate(), 3.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(Multiplication)
{
    BinaryOperation operation(
        Operation::Mul,
        Constant(5.0),
        Constant(2.0)
    );
    BOOST_CHECK_CLOSE(operation.Evaluate(), 10.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(Division)
{
    BinaryOperation operation{
        Operation::Div,
        Constant(10.0),
        Constant(2.0)
    };
    BOOST_CHECK_CLOSE(operation.Evaluate(), 5.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(DivisionByZero)
{
    BinaryOperation operation{
        Operation::Div,
        Constant(10.0),
        Constant(0.0)
    };
    try
    {
        operation.Evaluate();
        BOOST_FAIL("Expected std::runtime_error to be thrown");
    }
    catch (const std::runtime_error& e)
    {
        BOOST_CHECK_EQUAL(e.what(), "Division by 0");
    }
    catch (...)
    {
        BOOST_FAIL("Unexpected exception type thrown");
    }
}

BOOST_AUTO_TEST_CASE(Nestedoperationessions)
{
    // (2 + 3) * 4 = 20
    BinaryOperation operation(
        Operation::Mul,
        BinaryOperation(
            Operation::Add,
            Constant(2.0),
            Constant(3.0)
        ),
        Constant(4.0)
    );

    BOOST_CHECK_CLOSE(operation.Evaluate(), 20.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(Complexoperationession)
{
    // (10 / 2 - 1) * (3 + 1) = 16
    BinaryOperation operation(
        Operation::Mul,
        BinaryOperation(
            Operation::Sub,
            BinaryOperation(
                Operation::Div,
                Constant(10.0),
                Constant(2.0)
            ),
            Constant(1.0)
        ),
        BinaryOperation(
            Operation::Add,
            Constant(3.0),
            Constant(1.0)
        )
    );

    BOOST_CHECK_CLOSE(operation.Evaluate(), 16.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(ConstantToJson) {
    Constant constant(10.5);
    Json json = constant.ToJson();

    BOOST_TEST(json.at("type").as_string() == "constant");
    BOOST_TEST(json.at("value").as_double() == 10.5);
}

BOOST_AUTO_TEST_CASE(BinaryOperationToJson) {
    // Создаем выражение: (10 / 2 - 1) * (3 + 1)
    BinaryOperation operation(
        Operation::Mul,
        BinaryOperation(
            Operation::Sub,
            BinaryOperation(
                Operation::Div,
                Constant(10.0),
                Constant(2.0)
            ),
            Constant(1.0)
        ),
        BinaryOperation(
            Operation::Add,
            Constant(3.0),
            Constant(1.0)
        )
    );

    Json json = operation.ToJson();

    BOOST_TEST(json.at("type").as_string() == "binary");
    BOOST_TEST(json.at("op").as_int64() == static_cast<int>(Operation::Mul));

    const Json& left = json.at("left").as_object();
    BOOST_TEST(left.at("type").as_string() == "binary");
    BOOST_TEST(left.at("op").as_int64() == static_cast<int>(Operation::Sub));

    const Json& leftLeft = left.at("left").as_object();
    BOOST_TEST(leftLeft.at("type").as_string() == "binary");
    BOOST_TEST(leftLeft.at("op").as_int64() == static_cast<int>(Operation::Div));

    const Json& leftLeftLeft = leftLeft.at("left").as_object();
    BOOST_TEST(leftLeftLeft.at("type").as_string() == "constant");
    BOOST_TEST(leftLeftLeft.at("value").as_double() == 10.0);

    const Json& leftLeftRight = leftLeft.at("right").as_object();
    BOOST_TEST(leftLeftRight.at("type").as_string() == "constant");
    BOOST_TEST(leftLeftRight.at("value").as_double() == 2.0);

    const Json& leftRight = left.at("right").as_object();
    BOOST_TEST(leftRight.at("type").as_string() == "constant");
    BOOST_TEST(leftRight.at("value").as_double() == 1.0);

    const Json& right = json.at("right").as_object();
    BOOST_TEST(right.at("type").as_string() == "binary");
    BOOST_TEST(right.at("op").as_int64() == static_cast<int>(Operation::Add));

    const Json& rightLeft = right.at("left").as_object();
    BOOST_TEST(rightLeft.at("type").as_string() == "constant");
    BOOST_TEST(rightLeft.at("value").as_double() == 3.0);

    const Json& rightRight = right.at("right").as_object();
    BOOST_TEST(rightRight.at("type").as_string() == "constant");
    BOOST_TEST(rightRight.at("value").as_double() == 1.0);
}
