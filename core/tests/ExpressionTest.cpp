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
    BinaryExpression expr(
        std::make_unique<Constant>(5.0),
        std::make_unique<Constant>(2.0),
        Operation::Sub
    );
    BOOST_CHECK_CLOSE(expr.Evaluate(), 3.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(Multiplication)
{
    BinaryExpression expr(
        std::make_unique<Constant>(5.0),
        std::make_unique<Constant>(2.0),
        Operation::Mul
    );
    BOOST_CHECK_CLOSE(expr.Evaluate(), 10.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(Division)
{
    BinaryExpression expr{
        std::make_unique<Constant>(10.0),
        std::make_unique<Constant>(2.0),
        Operation::Div
    };
    BOOST_CHECK_CLOSE(expr.Evaluate(), 5.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(DivisionByZero)
{
    BinaryExpression expr{
        std::make_unique<Constant>(10.0),
        std::make_unique<Constant>(0.0),
        Operation::Div,
    };
    try
    {
        expr.Evaluate();
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

BOOST_AUTO_TEST_CASE(NestedExpressions)
{
    // (2 + 3) * 4 = 20
    BinaryExpression expr(
        std::make_unique<BinaryExpression>(
            std::make_unique<Constant>(2.0),
            std::make_unique<Constant>(3.0),
            Operation::Add
        ),
        std::make_unique<Constant>(4.0),
        Operation::Mul
    );

    BOOST_CHECK_CLOSE(expr.Evaluate(), 20.0, std::numeric_limits<double>::epsilon());
}

BOOST_AUTO_TEST_CASE(ComplexExpression)
{
    // (10 / 2 - 1) * (3 + 1) = 16
    BinaryExpression expr(
        std::make_unique<BinaryExpression>(
            std::make_unique<BinaryExpression>(
                std::make_unique<Constant>(10.0),
                std::make_unique<Constant>(2.0),
                Operation::Div
            ),
            std::make_unique<Constant>(1.0),
            Operation::Sub
        ),
        std::make_unique<BinaryExpression>(
            std::make_unique<Constant>(3.0), 
            std::make_unique<Constant>(1.0), 
            Operation::Add
        ),
        Operation::Mul
    );

    BOOST_CHECK_CLOSE(expr.Evaluate(), 16.0, std::numeric_limits<double>::epsilon());
}
