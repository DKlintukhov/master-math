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
#include "ExpressionGenerator.h"

using namespace MasterMath;


BOOST_AUTO_TEST_CASE(GenerateConstantTest) {
    ExpressionGeneratorConfig config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = true;
    config.useMul = true;
    config.useDiv = true;
    config.useFloats = true;

    ExpressionGenerator generator(config);

    Constant constant = generator.GenerateConstant();
    double value = constant.Evaluate();
    BOOST_CHECK(value >= config.min);
    BOOST_CHECK(value <= config.max);

    config.useFloats = false;
    ExpressionGenerator intGenerator(config);

    Constant intConstant = intGenerator.GenerateConstant();
    double intValue = intConstant.Evaluate();
    BOOST_CHECK(intValue >= config.min);
    BOOST_CHECK(intValue <= config.max);

    BOOST_CHECK(static_cast<int64_t>(intValue) == intValue);
}

BOOST_AUTO_TEST_CASE(GenerateOperationTest) {
    ExpressionGeneratorConfig config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = false;
    config.useMul = true;
    config.useDiv = false;
    config.useFloats = true;

    ExpressionGenerator generator(config);

    Operation op = generator.GenerateOperation();
    BOOST_CHECK(op == Operation::Add || op == Operation::Mul);
}

// BOOST_AUTO_TEST_CASE(GenerateBinaryExpressionTest_SubtractionAvoidance) {
//     ExpressionGeneratorConfig config;
//     config.min = 1.0;
//     config.max = 2.0;
//     config.useAdd = false;
//     config.useSub = true;
//     config.useMul = false;
//     config.useDiv = false;
//     config.useFloats = false;

//     ExpressionGenerator generator(config);
//     BinaryExpression binaryExpr = generator.GenerateBinaryExpression();

//     if (binaryExpr.m_op == Operation::Sub) {
//         double leftValue = binaryExpr.m_left->Evaluate();
//         double rightValue = binaryExpr.m_right->Evaluate();
//         BOOST_CHECK(leftValue >= rightValue);
//     }
// }

// BOOST_AUTO_TEST_CASE(GenerateBinaryExpressionTest_DivisionByZeroAvoidance) {
//     ExpressionGeneratorConfig config;
//     config.min = 0.0;
//     config.max = 1.0;
//     config.useAdd = false;
//     config.useSub = false;
//     config.useMul = false;
//     config.useDiv = true;
//     config.useFloats = true;

//     ExpressionGenerator generator(config);
//     BinaryExpression binaryExpr = generator.GenerateBinaryExpression();

//     if (binaryExpr.m_op == Operation::Div) {
//         double rightValue = binaryExpr.m_right->Evaluate();
//         BOOST_CHECK(rightValue != 0.0); // Ensure right value is not zero
//         BOOST_CHECK(!std::isnan(binaryExpr.Evaluate())); //Ensure evaluation does not return Nan when dividing.
//     }
// }

BOOST_AUTO_TEST_CASE(GenerateExpressionTest) {
    ExpressionGeneratorConfig config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = true;
    config.useMul = true;
    config.useDiv = true;
    config.useFloats = true;

    ExpressionGenerator generator(config);

    std::unique_ptr<Expression> expression = generator.GenerateExpression();
    BOOST_CHECK(expression != nullptr);
}
